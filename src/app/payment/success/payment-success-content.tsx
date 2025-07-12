"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Music, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/cartStore";
import { api } from "@/trpc/react";
import { DownloadButton } from "@/components/shared/download-button";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  // Fetch order details from backend
  const {
    data: order,
    isLoading,
    isError,
  } = api.order.getOrderBySessionId.useQuery(
    { sessionId: sessionId ?? "" },
    { enabled: !!sessionId },
  );

  useEffect(() => {
    if (order) {
      clearCart();
    }
  }, [order, clearCart]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-4">
            Processing your payment...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
            <CheckCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Payment Not Found
          </h1>
          <p className="text-muted-foreground text-lg">
            We couldn&apos;t find your order. Please contact support if you
            believe this is an error.
          </p>
          <Button asChild variant="outline" className="mt-6 border-white/20">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Success Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
          >
            <CheckCircle className="h-12 w-12 text-green-500" />
          </motion.div>

          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your tracks are ready for download.
          </p>
        </div>

        {/* Order Details */}
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h2 className="text-foreground text-xl font-semibold">
                Order Details
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">Order #</div>
                  <div className="text-foreground font-mono text-lg">
                    {order.orderNumber}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">
                    Total Amount
                  </div>
                  <div className="text-foreground text-2xl font-bold">
                    ${(order.total / 100).toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">Items</div>
                  <div className="text-foreground text-lg font-semibold">
                    {order.items.length} track
                    {order.items.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              {/* Purchased Items */}
              <div className="mt-6">
                <h3 className="text-foreground mb-2 text-lg font-medium">
                  Purchased Tracks
                </h3>
                <div className="divide-muted-foreground/10 border-muted-foreground/10 bg-background divide-y rounded-lg border">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row"
                    >
                      <div className="flex items-center gap-3">
                        <Music className="text-primary h-6 w-6" />
                        <div>
                          <div className="text-foreground font-semibold">
                            {item.track?.name ?? "Track"}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {item.licenseType} License
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-foreground font-mono text-base">
                          ${(item.unitPrice / 100).toFixed(2)}
                        </div>
                        {item.track && (
                          <DownloadButton
                            trackId={item.track.id}
                            variant="ghost"
                            size="sm"
                            className="text-green-600"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            A confirmation email has been sent to your email address with
            download instructions.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
