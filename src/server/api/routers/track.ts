import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  protectedAdminRoute,
} from "@/server/api/trpc";
import { supabaseServer } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export const trackRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.track.findMany({
      orderBy: { createdAt: "desc" },
      where: { status: "published" },
      include: { prices: true },
    });
  }),

  getAllByAdmin: protectedAdminRoute.query(async ({ ctx }) => {
    return await ctx.db.track.findMany({
      orderBy: { createdAt: "desc" },
      include: { prices: true },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const track = await ctx.db.track.findUnique({
        where: { id: input.id },
        include: { prices: true },
      });

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        });
      }

      return track;
    }),

  getPricesById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const track = await ctx.db.track.findUnique({
        where: { id: input.id },
        include: { prices: true },
      });

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        });
      }

      return track.prices;
    }),

  getPricesByIds: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const tracks = await ctx.db.track.findMany({
        where: { id: { in: input.ids } },
        include: { prices: true },
      });

      // Flatten all prices from all tracks
      return tracks.flatMap((track) => track.prices);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        artist: z.string().min(1),
        description: z.string().optional(),
        duration: z.number().min(0),
        audioUrl: z.string().url(),
        coverUrl: z.string().url().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
        prices: z
          .array(
            z.object({
              licenseType: z.string().min(1),
              price: z.number().min(0),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create tracks",
        });
      }

      // Create Stripe product
      const product = await stripe.products.create({
        name: input.name,
        description: input.description,
        metadata: {
          artist: input.artist,
        },
      });

      // Create Stripe prices for each license type
      const trackPrices = await Promise.all(
        input.prices.map(async (p) => {
          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: p.price,
            currency: "usd",
            metadata: { licenseType: p.licenseType },
          });
          return {
            licenseType: p.licenseType,
            price: p.price,
            stripePriceId: price.id,
          };
        }),
      );

      // Create the track and associated prices in the DB
      const track = await ctx.db.track.create({
        data: {
          name: input.name,
          artist: input.artist,
          description: input.description,
          duration: input.duration,
          audioUrl: input.audioUrl,
          coverUrl: input.coverUrl,
          status: input.status,
          userId: ctx.user.id,
          stripeProductId: product.id,
          prices: {
            create: trackPrices,
          },
        },
        include: { prices: true },
      });
      return track;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        artist: z.string().min(1).optional(),
        description: z.string().optional(),
        duration: z.number().min(0).optional(),
        audioUrl: z.string().url().optional(),
        coverUrl: z.string().url().optional(),
        status: z.enum(["draft", "published"]).optional(),
        prices: z
          .array(
            z.object({
              id: z.string().optional(), // present if existing
              licenseType: z.string().min(1),
              price: z.number().min(0),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, prices, ...data } = input;

      // Check if user is admin or owns the track
      const track = await ctx.db.track.findUnique({
        where: { id },
        include: { prices: true },
      });

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        });
      }

      if (!ctx.user.isAdmin && track.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own tracks",
        });
      }

      // Handle price updates if provided
      if (prices) {
        // 1. Update existing prices
        for (const p of prices) {
          if (p.id) {
            // Find the existing price
            const existing = track.prices.find((tp) => tp.id === p.id);
            if (existing && existing.price !== p.price) {
              // Update Stripe price (archive old, create new)
              await stripe.prices.update(existing.stripePriceId, {
                active: false,
              });
              const newStripePrice = await stripe.prices.create({
                product: track.stripeProductId!,
                unit_amount: p.price,
                currency: "usd",
                metadata: { licenseType: p.licenseType },
              });
              // Update DB: replace old price with new
              await ctx.db.trackPrice.update({
                where: { id: p.id },
                data: {
                  price: p.price,
                  stripePriceId: newStripePrice.id,
                  licenseType: p.licenseType,
                },
              });
            } else if (existing && existing.licenseType !== p.licenseType) {
              // Only license type changed
              await ctx.db.trackPrice.update({
                where: { id: p.id },
                data: { licenseType: p.licenseType },
              });
            }
          } else {
            // 2. Add new price
            const newStripePrice = await stripe.prices.create({
              product: track.stripeProductId!,
              unit_amount: p.price,
              currency: "usd",
              metadata: { licenseType: p.licenseType },
            });
            await ctx.db.trackPrice.create({
              data: {
                trackId: track.id,
                licenseType: p.licenseType,
                price: p.price,
                stripePriceId: newStripePrice.id,
              },
            });
          }
        }
        // 3. Remove deleted prices
        const updatedIds = prices.filter((p) => p.id).map((p) => p.id);
        for (const old of track.prices) {
          if (!updatedIds.includes(old.id)) {
            // Archive Stripe price
            await stripe.prices.update(old.stripePriceId, { active: false });
            // Remove from DB
            await ctx.db.trackPrice.delete({ where: { id: old.id } });
          }
        }
      }

      const updatedTrack = await ctx.db.track.update({
        where: { id },
        data,
        include: { prices: true },
      });
      return updatedTrack;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin or owns the track
      const track = await ctx.db.track.findUnique({
        where: { id: input.id },
        select: { userId: true, audioUrl: true },
      });

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        });
      }

      if (!ctx.user.isAdmin && track.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own tracks",
        });
      }

      try {
        // Extract the file path from the audioUrl
        // The audioUrl is stored as a full public URL like:
        // https://project.supabase.co/storage/v1/object/public/tracks/userId/filename.mp3
        const url = new URL(track.audioUrl);
        const pathParts = url.pathname.split("/");

        console.log("URL pathname:", url.pathname);
        console.log("Path parts:", pathParts);

        // Find the index of 'tracks' in the path and get everything after it
        const tracksIndex = pathParts.findIndex((part) => part === "tracks");
        console.log("Tracks index:", tracksIndex);

        if (tracksIndex !== -1 && tracksIndex < pathParts.length - 1) {
          const filePath = pathParts.slice(tracksIndex + 1).join("/");
          console.log("Extracted file path:", filePath);

          if (filePath) {
            console.log("Attempting to delete file:", filePath);
            const { error: storageError } = await supabaseServer.storage
              .from("tracks")
              .remove([filePath]);

            if (storageError) {
              console.error("Error deleting file from storage:", storageError);
            } else {
              console.log("Successfully deleted file from storage:", filePath);
            }
          }
        } else {
          console.error(
            "Could not find 'tracks' in path or invalid path structure",
          );
        }
      } catch (error) {
        console.error("Error deleting file from storage:", error);
      }

      // Delete associated prices first
      await ctx.db.trackPrice.deleteMany({
        where: { trackId: input.id },
      });

      const deletedTrack = await ctx.db.track.delete({
        where: { id: input.id },
      });

      return deletedTrack;
    }),
});
