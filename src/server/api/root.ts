import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { trackRouter } from "./routers/track";
import { authRouter } from "./routers/auth";
import { orderRouter } from "./routers/order";
import { stripeRouter } from "./routers/stripe";
import { contactRouter } from "./routers/contact";
import { bookingRouter } from "./routers/booking";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  track: trackRouter,
  auth: authRouter,
  order: orderRouter,
  stripe: stripeRouter,
  contact: contactRouter,
  booking: bookingRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
