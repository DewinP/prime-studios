import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { z } from "zod";

const createCartCheckoutSchema = z.object({
  items: z.array(
    z.object({
      trackId: z.string(),
      trackName: z.string(),
      artist: z.string(),
      licenseType: z.string(),
      price: z.number(),
      stripePriceId: z.string(),
      coverUrl: z.string().nullable().optional(),
    }),
  ),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;
    const { items, successUrl, cancelUrl } =
      createCartCheckoutSchema.parse(body);

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create line items for Stripe checkout
    const lineItems = items.map((item) => ({
      price: item.stripePriceId,
      quantity: 1,
    }));

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        itemCount: items.length.toString(),
        totalAmount: items
          .reduce((sum, item) => sum + item.price, 0)
          .toString(),
        items: JSON.stringify(
          items.map((item) => ({
            trackId: item.trackId,
            trackName: item.trackName,
            artist: item.artist,
            licenseType: item.licenseType,
            price: item.price,
          })),
        ),
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    // Save a pending payment record in the database
    const paymentData = {
      userId: null, // Will be set when user completes payment
      stripeSessionId: session.id,
      stripePaymentId: null,
      stripeProductId: "cart_checkout", // Special identifier for cart checkouts
      amount: totalAmount,
      currency: "usd",
      status: "pending",
      description: `Cart checkout - ${items.length} item${items.length > 1 ? "s" : ""}`,
      metadata: {
        itemCount: items.length,
        items: items.map((item) => ({
          trackId: item.trackId,
          trackName: item.trackName,
          artist: item.artist,
          licenseType: item.licenseType,
          price: item.price,
        })),
      },
    };
    await db.payment.create({ data: paymentData });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating cart checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
