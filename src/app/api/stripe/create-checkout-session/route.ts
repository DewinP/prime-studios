import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { z } from "zod";

const createCheckoutSessionSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default("usd"),
  productId: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;
    const {
      amount,
      currency,
      productId,
      description,
      metadata,
      successUrl,
      cancelUrl,
    } = createCheckoutSessionSchema.parse(body);

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: description ?? "Studio Session",
              description: description ?? "Payment for studio services",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        productId,
        description: description ?? "",
        ...metadata,
      },
    });

    // Save a pending payment record in the database
    const paymentData = {
      userId: null,
      stripeSessionId: session.id,
      stripePaymentId: null,
      stripeProductId: productId,
      amount,
      currency,
      status: "pending",
      description: description ?? "",
      metadata: metadata ?? {},
    };
    await db.payment.create({ data: paymentData });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
