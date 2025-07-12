import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { stripe } from "@/lib/stripe";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { sendOrderEmail, createOrderEmailTemplate } from "@/lib/email";

export const stripeRouter = createTRPCRouter({
  webhook: publicProcedure
    .input(
      z.object({
        body: z.string(),
        signature: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { body, signature } = input;

      let event;

      console.log("-----------trpc api router---------------------");

      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          env.STRIPE_WEBHOOK_SECRET,
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid signature",
        });
      }

      try {
        console.log("Webhook received:", event.type);
        switch (event.type) {
          // --- CHARGE EVENTS ---
          case "charge.succeeded": {
            const charge = event.data.object as {
              id: string;
              payment_intent?: string;
            };
            console.log("[Webhook] charge.succeeded", charge.id);
            // Optionally update your DB for successful charges
            break;
          }
          case "charge.refunded": {
            const charge = event.data.object as {
              id: string;
              payment_intent?: string;
            };
            console.log("[Webhook] charge.refunded", charge.id);
            // Mark order as refunded
            if (charge.payment_intent) {
              await ctx.db.order.updateMany({
                where: { stripePaymentId: charge.payment_intent },
                data: { status: "refunded", updatedAt: new Date() },
              });
            }
            break;
          }

          // --- CHECKOUT EVENTS ---
          case "checkout.session.completed": {
            console.log("-----");
            console.log("🎉 CHECKOUT SESSION COMPLETED - CREATING ORDER");
            const session = event.data.object as {
              id: string;
              payment_intent?: string;
              customer_details?: {
                email?: string;
                name?: string;
              };
              metadata?: {
                items?: string;
                userId?: string;
                subtotal?: string;
                tax?: string;
                total?: string;
              };
            };
            console.log("[Webhook] checkout.session.completed received", {
              sessionId: session.id,
              payment_intent: session.payment_intent,
            });

            // Create order from session metadata
            if (session.metadata?.items) {
              console.log("📦 Found items in metadata, creating order...");
              // Check if order already exists for this session
              const existingOrder = await ctx.db.order.findFirst({
                where: { stripeSessionId: session.id },
              });

              if (existingOrder) {
                console.log(
                  "[Webhook] Order already exists for session:",
                  session.id,
                );
                break;
              }
              const items = JSON.parse(session.metadata.items) as Array<{
                trackId: string;
                trackPriceId?: string;
                licenseType: string;
                quantity: number;
                unitPrice: number;
                stripePriceId?: string;
              }>;

              // Generate order number (YYYYMMDD-XXXX format)
              const today = new Date();
              const dateStr = today
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
              const orderCount = await ctx.db.order.count({
                where: {
                  createdAt: {
                    gte: new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate(),
                    ),
                  },
                },
              });
              const orderNumber = `${dateStr}-${String(orderCount + 1).padStart(4, "0")}`;

              // Create order in database
              const order = await ctx.db.order.create({
                data: {
                  userId:
                    session.metadata.userId && session.metadata.userId !== ""
                      ? session.metadata.userId
                      : null, // null for guest orders
                  orderNumber,
                  status: "paid",
                  subtotal: parseInt(session.metadata.subtotal ?? "0"),
                  tax: parseInt(session.metadata.tax ?? "0"),
                  total: parseInt(session.metadata.total ?? "0"),
                  currency: "usd",
                  billingEmail: session.customer_details?.email ?? "",
                  billingName: session.customer_details?.name ?? "",
                  stripePaymentId: session.payment_intent,
                  stripeSessionId: session.id,
                  items: {
                    create: items.map((item) => ({
                      trackId: item.trackId,
                      trackPriceId: item.trackPriceId,
                      licenseType: item.licenseType,
                      quantity: item.quantity,
                      unitPrice: item.unitPrice,
                      totalPrice: item.unitPrice * item.quantity,
                      stripePriceId: item.stripePriceId,
                    })),
                  },
                },
                include: {
                  items: {
                    include: {
                      track: true,
                      trackPrice: true,
                    },
                  },
                },
              });

              // Send order confirmation email to billing email and user email (if logged in)
              const emailsToSend = new Set<string>();
              if (order.billingEmail) {
                emailsToSend.add(order.billingEmail);
              }
              if (order.userId) {
                const user = await ctx.db.user.findUnique({
                  where: { id: order.userId },
                });
                if (user?.email) {
                  emailsToSend.add(user.email);
                }
              }

              const emailHtml = createOrderEmailTemplate({
                orderNumber: order.orderNumber,
                total: order.total,
                items: order.items.map((item) => ({
                  trackName: item.track?.name ?? "Track",
                  licenseType: item.licenseType,
                  unitPrice: item.unitPrice,
                })),
                customerName: order.billingName ?? undefined,
              });

              for (const email of emailsToSend) {
                console.log("Sending email to:", email);
                await sendOrderEmail({
                  to: email,
                  subject: "Your Order Confirmation - Prime Studios",
                  html: emailHtml,
                });
              }

              console.log(
                "✅ ORDER CREATED SUCCESSFULLY:",
                order.id,
                orderNumber,
              );
              console.log("💰 Total:", (order.total / 100).toFixed(2));
              console.log("📧 Customer:", order.billingEmail);
              console.log("-----");
            } else {
              console.log("⚠️ No items found in session metadata");
            }

            console.log("🎯 Order processing completed");
            break;
          }
          case "checkout.session.async_payment_succeeded": {
            const session = event.data.object as {
              id: string;
              payment_intent?: string;
              customer_details?: {
                email?: string;
                name?: string;
              };
              metadata?: {
                items?: string;
                userId?: string;
                subtotal?: string;
                tax?: string;
                total?: string;
              };
            };
            console.log("[Webhook] async_payment_succeeded", session.id);

            // Create order from session metadata (same logic as completed)
            if (session.metadata?.items) {
              // Check if order already exists for this session
              const existingOrder = await ctx.db.order.findFirst({
                where: { stripeSessionId: session.id },
              });

              if (existingOrder) {
                console.log(
                  "[Webhook] Order already exists for session:",
                  session.id,
                );
                break;
              }
              const items = JSON.parse(session.metadata.items) as Array<{
                trackId: string;
                trackPriceId?: string;
                licenseType: string;
                quantity: number;
                unitPrice: number;
                stripePriceId?: string;
              }>;

              // Generate order number (YYYYMMDD-XXXX format)
              const today = new Date();
              const dateStr = today
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
              const orderCount = await ctx.db.order.count({
                where: {
                  createdAt: {
                    gte: new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate(),
                    ),
                  },
                },
              });
              const orderNumber = `${dateStr}-${String(orderCount + 1).padStart(4, "0")}`;

              // Create order in database
              const order = await ctx.db.order.create({
                data: {
                  userId:
                    session.metadata.userId && session.metadata.userId !== ""
                      ? session.metadata.userId
                      : null, // null for guest orders
                  orderNumber,
                  status: "paid",
                  subtotal: parseInt(session.metadata.subtotal ?? "0"),
                  tax: parseInt(session.metadata.tax ?? "0"),
                  total: parseInt(session.metadata.total ?? "0"),
                  currency: "usd",
                  billingEmail: session.customer_details?.email ?? "",
                  billingName: session.customer_details?.name ?? "",
                  stripePaymentId: session.payment_intent,
                  stripeSessionId: session.id,
                  items: {
                    create: items.map((item) => ({
                      trackId: item.trackId,
                      trackPriceId: item.trackPriceId,
                      licenseType: item.licenseType,
                      quantity: item.quantity,
                      unitPrice: item.unitPrice,
                      totalPrice: item.unitPrice * item.quantity,
                      stripePriceId: item.stripePriceId,
                    })),
                  },
                },
                include: {
                  items: {
                    include: {
                      track: true,
                      trackPrice: true,
                    },
                  },
                },
              });

              // Send order confirmation email to billing email and user email (if logged in)
              const emailsToSend = new Set<string>();
              if (order.billingEmail) {
                emailsToSend.add(order.billingEmail);
              }
              if (order.userId) {
                const user = await ctx.db.user.findUnique({
                  where: { id: order.userId },
                });
                if (user?.email) {
                  emailsToSend.add(user.email);
                }
              }

              const emailHtml = createOrderEmailTemplate({
                orderNumber: order.orderNumber,
                total: order.total,
                items: order.items.map((item) => ({
                  trackName: item.track?.name ?? "Track",
                  licenseType: item.licenseType,
                  unitPrice: item.unitPrice,
                })),
                customerName: order.billingName ?? undefined,
              });

              for (const email of emailsToSend) {
                console.log("Sending email to:", email);
                await sendOrderEmail({
                  to: email,
                  subject: "Your Order Confirmation - Prime Studios",
                  html: emailHtml,
                });
              }

              console.log(
                "[Webhook] Order created from async payment:",
                order.id,
                orderNumber,
              );
            }
            break;
          }
          case "checkout.session.async_payment_failed": {
            const session = event.data.object as { id: string };
            console.log("[Webhook] async_payment_failed", session.id);
            // Could send notification to user about failed payment
            break;
          }
          case "checkout.session.expired": {
            const session = event.data.object as { id: string };
            console.log("[Webhook] session.expired", session.id);
            // Could send reminder to user to complete payment
            break;
          }

          // --- PAYMENT INTENT EVENTS ---
          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as { id: string };
            console.log("[Webhook] payment_intent.succeeded", paymentIntent.id);
            // Payment intent succeeded - order already created in checkout.session.completed
            break;
          }

          case "payment_intent.created":
            const createdPayment = event.data.object as { id: string };
            console.log("Payment intent created:", createdPayment.id);
            break;

          case "payment_intent.payment_failed":
            const failedPayment = event.data.object as { id: string };
            console.log("Payment failed:", failedPayment.id);
            // Handle payment failure if needed
            break;

          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
      } catch (error) {
        console.error("Error processing webhook:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Webhook processing failed",
        });
      }
    }),
});
