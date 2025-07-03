import {
  createTRPCRouter,
  publicProcedure,
  protectedAdminRoute,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSessionWithUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    return { ...ctx.session, user };
  }),
  getAllAdmins: protectedAdminRoute.query(async () => {
    const admins = await db.user.findMany({
      where: { isAdmin: true },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return admins;
  }),
});
