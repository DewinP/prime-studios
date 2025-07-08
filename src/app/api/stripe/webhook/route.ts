import { type NextRequest, NextResponse } from "next/server";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  try {
    // Create tRPC context and caller
    const ctx = await createTRPCContext({ headers: request.headers });
    const caller = createCaller(ctx);
    // Call the webhook procedure
    await caller.stripe.webhook({
      body,
      signature,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);

    // Handle tRPC errors
    if (error instanceof Error) {
      if (error.message.includes("Invalid signature")) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 },
        );
      }
      if (error.message.includes("Webhook processing failed")) {
        return NextResponse.json(
          { error: "Webhook processing failed" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
