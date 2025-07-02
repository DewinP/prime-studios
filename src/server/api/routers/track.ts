import { z } from "zod";
import { createTRPCRouter, protectedAdminRoute } from "@/server/api/trpc";

export const trackRouter = createTRPCRouter({
  getAll: protectedAdminRoute.query(async ({ ctx }) => {
    return await ctx.db.track.findMany();
  }),

  create: protectedAdminRoute
    .input(
      z.object({
        name: z.string().min(1),
        artist: z.string().min(1),
        description: z.string().optional(),
        duration: z.number().positive(),
        audioUrl: z.string().url(),
        coverUrl: z.string().url().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const track = await ctx.db.track.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return track;
    }),

  update: protectedAdminRoute
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        artist: z.string().min(1).optional(),
        description: z.string().optional(),
        duration: z.number().positive().optional(),
        audioUrl: z.string().url().optional(),
        coverUrl: z.string().url().optional(),
        status: z.enum(["draft", "published"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const track = await ctx.db.track.update({
        where: { id, userId: ctx.session.user.id },
        data,
      });
      return track;
    }),

  delete: protectedAdminRoute
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const track = await ctx.db.track.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      return track;
    }),
});
