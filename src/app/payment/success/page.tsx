"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, Music, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/cartStore";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<{
    sessionId?: string;
    amount?: number;
    itemCount?: number;
  } | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // You could fetch payment details from your API here
      setPaymentDetails({
        sessionId,
        amount: 0, // This would come from your API
        itemCount: 0, // This would come from your API
      });

      // Clear the cart on successful payment
      clearCart();
    }

    setIsLoading(false);
  }, [searchParams, clearCart]);

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
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

        {/* Payment Details */}
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h2 className="text-foreground text-xl font-semibold">
                Order Details
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">Order ID</div>
                  <div className="text-foreground font-mono text-lg">
                    {paymentDetails?.sessionId?.slice(-8) ?? "N/A"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-muted-foreground text-sm">
                    Total Amount
                  </div>
                  <div className="text-foreground text-2xl font-bold">
                    ${((paymentDetails?.amount ?? 0) / 100).toFixed(2)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-muted-foreground text-sm">Items</div>
                  <div className="text-foreground text-lg font-semibold">
                    {paymentDetails?.itemCount ?? 0} track
                    {(paymentDetails?.itemCount ?? 0) !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Download className="h-6 w-6 text-blue-500" />
                <h2 className="text-foreground text-xl font-semibold">
                  What's Next?
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="text-foreground font-medium">
                      Download Your Tracks
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Your high-quality audio files are ready for immediate
                      download.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="text-foreground font-medium">
                      License Agreement
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Review your license terms for the selected tracks.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="text-foreground font-medium">Support</div>
                    <div className="text-muted-foreground text-sm">
                      Need help? Contact our support team anytime.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="outline" className="border-white/20">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>

          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Download Tracks
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
