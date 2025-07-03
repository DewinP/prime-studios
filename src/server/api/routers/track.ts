import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  protectedAdminRoute,
} from "@/server/api/trpc";

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
          message: "You can only delete your own tracks",
        });
      }

      const deletedTrack = await ctx.db.track.delete({
        where: { id: input.id },
      });
      return deletedTrack;
    }),
});
