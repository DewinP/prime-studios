import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { stripe } from "@/lib/stripe";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const orderRouter = createTRPCRouter({
  getOrderHistory: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        items: {
          include: {
            track: true,
            trackPrice: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getAllOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        status: z
          .enum(["all", "pending", "paid", "cancelled", "refunded"])
          .default("all"),
        sortBy: z
          .enum(["createdAt", "total", "orderNumber", "status"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
        dateFrom,
        dateTo,
      } = input;
      const offset = (page - 1) * limit;

      // Build where conditions
      const whereConditions: Prisma.OrderWhereInput = {};

      // Status filter
      if (status !== "all") {
        whereConditions.status = status;
      }

      // Date range filter
      if (dateFrom || dateTo) {
        whereConditions.createdAt = {};
        if (dateFrom) {
          whereConditions.createdAt.gte = new Date(dateFrom);
        }
        if (dateTo) {
          whereConditions.createdAt.lte = new Date(dateTo + "T23:59:59.999Z");
        }
      }

      // Search filter
      if (search) {
        whereConditions.OR = [
          { orderNumber: { contains: search, mode: "insensitive" } },
          { billingEmail: { contains: search, mode: "insensitive" } },
          { billingName: { contains: search, mode: "insensitive" } },
          { user: { name: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ];
      }

      // Build orderBy
      const orderBy: Prisma.OrderOrderByWithRelationInput = {};
      orderBy[sortBy] = sortOrder;

      const [orders, totalCount] = await Promise.all([
        ctx.db.order.findMany({
          where: whereConditions,
          include: {
            items: {
              include: {
                track: true,
                trackPrice: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        ctx.db.order.count({
          where: whereConditions,
        }),
      ]);

      return {
        orders,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      };
    }),

  getOrderStatus: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input, ctx }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          id: input.orderId,
          userId: ctx.session.user.id,
        },
      });

      return order?.status ?? "not_found";
    }),

  createOrder: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            trackId: z.string(),
            trackPriceId: z.string().optional(),
            licenseType: z.string(),
            quantity: z.number().min(1).default(1),
            unitPrice: z.number().min(0),
            stripePriceId: z.string().optional(),
          }),
        ),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { items, successUrl, cancelUrl } = input;
      const userId = ctx.session.user.id;

      // Calculate totals
      const subtotal = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      );
      const tax = 0; // No tax
      const total = subtotal;

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.licenseType} License`,
              description: `License for track purchase`,
            },
            unit_amount: item.unitPrice,
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          items: JSON.stringify(items),
          userId,
          subtotal: subtotal.toString(),
          tax: tax.toString(),
          total: total.toString(),
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
        total: total / 100, // Convert cents to dollars for display
      };
    }),

  createGuestOrder: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            trackId: z.string(),
            trackPriceId: z.string().optional(),
            licenseType: z.string(),
            quantity: z.number().min(1).default(1),
            unitPrice: z.number().min(0),
            stripePriceId: z.string().optional(),
          }),
        ),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      const { items, successUrl, cancelUrl } = input;

      // Calculate totals
      const subtotal = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      );
      const tax = 0; // No tax
      const total = subtotal;

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.licenseType} License`,
              description: `License for track purchase`,
            },
            unit_amount: item.unitPrice,
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          items: JSON.stringify(items),
          userId: "", // Guest order
          subtotal: subtotal.toString(),
          tax: tax.toString(),
          total: total.toString(),
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
        total: total / 100, // Convert cents to dollars for display
      };
    }),

  getOrderAnalytics: protectedProcedure.query(async ({ ctx }) => {
    // Get all orders for analytics
    const orders = await ctx.db.order.findMany({
      where: {
        status: "paid",
      },
      include: {
        items: {
          include: {
            track: true,
            trackPrice: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate total purchases
    const totalPurchases = orders.length;

    // Get latest orders (last 5)
    const latestOrders = orders.slice(0, 5);

    // Get revenue by day for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().slice(0, 10);
    }).reverse();

    const revenueByDay = last7Days.map((date) => {
      const dayOrders = orders.filter(
        (order) => order.createdAt.toISOString().slice(0, 10) === date,
      );
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      return {
        date,
        revenue: revenue / 100, // Convert to dollars
      };
    });

    // Get top performing tracks
    const trackRevenue = new Map<
      string,
      { name: string; revenue: number; sales: number }
    >();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.track) {
          const key = item.track.id;
          const existing = trackRevenue.get(key) ?? {
            name: item.track.name,
            revenue: 0,
            sales: 0,
          };
          existing.revenue += item.totalPrice;
          existing.sales += item.quantity;
          trackRevenue.set(key, existing);
        }
      });
    });

    const topTracks = Array.from(trackRevenue.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((track) => ({
        name: track.name,
        revenue: track.revenue / 100, // Convert to dollars
        sales: track.sales,
      }));

    return {
      totalRevenue: totalRevenue / 100, // Convert to dollars
      totalPurchases,
      latestOrders,
      revenueByDay,
      topTracks,
    };
  }),

  getOrderBySessionId: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const order = await ctx.db.order.findFirst({
        where: { stripeSessionId: input.sessionId },
        include: {
          items: {
            include: {
              track: true,
              trackPrice: true,
            },
          },
        },
      });
      return order;
    }),

  getOrderById: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input, ctx }) => {
      const order = await ctx.db.order.findFirst({
        where: { id: input.orderId },
        include: {
          items: {
            include: {
              track: true,
              trackPrice: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return order;
    }),

  getPaymentDetails: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input, ctx }) => {
      const order = await ctx.db.order.findFirst({
        where: { id: input.orderId },
        select: { stripePaymentId: true },
      });

      if (!order?.stripePaymentId) {
        return null;
      }

      try {
        // Fetch payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
          order.stripePaymentId,
        );

        if (paymentIntent.payment_method) {
          // Fetch payment method details
          const paymentMethod = await stripe.paymentMethods.retrieve(
            paymentIntent.payment_method as string,
          );

          return {
            last4: paymentMethod.card?.last4,
            brand: paymentMethod.card?.brand,
            expMonth: paymentMethod.card?.exp_month,
            expYear: paymentMethod.card?.exp_year,
            country: paymentMethod.card?.country,
          };
        }

        return null;
      } catch (error) {
        console.error("Error fetching payment details from Stripe:", error);
        return null;
      }
    }),
});
