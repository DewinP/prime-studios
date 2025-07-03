import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  protectedAdminRoute,
} from "@/server/api/trpc";
import { supabaseServer } from "@/lib/supabase-server";

export const trackRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.track.findMany({
      orderBy: { createdAt: "desc" },
      where: { status: "published" },
    });
  }),

  getAllByAdmin: protectedAdminRoute.query(async ({ ctx }) => {
    return await ctx.db.track.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const track = await ctx.db.track.findUnique({
        where: { id: input.id },
      });

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        });
      }

      return track;
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin (using context user data)
      if (!ctx.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create tracks",
        });
      }

      const track = await ctx.db.track.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Check if user is admin or owns the track
      const track = await ctx.db.track.findUnique({
        where: { id },
        select: { userId: true },
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

      const updatedTrack = await ctx.db.track.update({
        where: { id },
        data,
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

      const deletedTrack = await ctx.db.track.delete({
        where: { id: input.id },
      });

      return deletedTrack;
    }),
});
