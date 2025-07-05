import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/env";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
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
        // Mark payment as refunded
        if (charge.payment_intent) {
          await db.payment.updateMany({
            where: { stripePaymentId: charge.payment_intent },
            data: { status: "refunded", updatedAt: new Date() },
          });
        }
        break;
      }

      // --- CHECKOUT EVENTS ---
      case "checkout.session.completed": {
        const session = event.data.object as {
          id: string;
          payment_intent?: string;
        };
        console.log("[Webhook] checkout.session.completed received", {
          sessionId: session.id,
          payment_intent: session.payment_intent,
        });
        if (session.payment_intent) {
          const payment = await db.payment.findFirst({
            where: { stripeSessionId: session.id },
          });
          if (payment) {
            console.log("[Webhook] Found payment record for session", payment);
            await db.payment.update({
              where: { id: payment.id },
              data: {
                stripePaymentId: session.payment_intent,
                status: "succeeded",
                updatedAt: new Date(),
              },
            });
            console.log(
              "[Webhook] Payment record updated to succeeded with payment_intent",
              session.payment_intent,
            );
          } else {
            console.log(
              "[Webhook] No payment record found for session:",
              session.id,
            );
          }
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as { id: string };
        console.log("[Webhook] async_payment_succeeded", session.id);
        await db.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: "succeeded", updatedAt: new Date() },
        });
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as { id: string };
        console.log("[Webhook] async_payment_failed", session.id);
        await db.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: "failed", updatedAt: new Date() },
        });
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as { id: string };
        console.log("[Webhook] session.expired", session.id);
        await db.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: "expired", updatedAt: new Date() },
        });
        break;
      }

      // --- PAYMENT INTENT EVENTS ---
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as { id: string };
        console.log("[Webhook] payment_intent.succeeded", paymentIntent.id);
        await db.payment.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: { status: "succeeded", updatedAt: new Date() },
        });
        break;
      }

      case "payment_intent.created":
        const createdPayment = event.data.object as { id: string };
        console.log("Payment intent created:", createdPayment.id);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as { id: string };

        // Update payment status in database
        await db.payment.updateMany({
          where: { stripePaymentId: failedPayment.id },
          data: {
            status: "failed",
            updatedAt: new Date(),
          },
        });

        console.log("Payment failed:", failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
