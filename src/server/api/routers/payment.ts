import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const paymentRouter = createTRPCRouter({
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.payment.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getPaymentStatus: protectedProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ input, ctx }) => {
      const payment = await ctx.db.payment.findFirst({
        where: {
          stripePaymentId: input.paymentIntentId,
          userId: ctx.session.user.id,
        },
      });

      return payment?.status ?? "not_found";
    }),
});
