"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface PaymentFormProps {
  amount: number;
  productId: string;
  description?: string;
  metadata?: Record<string, string>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentForm({
  amount,
  productId,
  description,
  metadata,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          productId,
          description,
          metadata,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment`,
        }),
      });

      const data = (await response.json()) as { url?: string };

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      toast.error("Failed to create checkout session");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          {description ?? "Click the button below to proceed with payment"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted flex items-center justify-between rounded-lg p-4">
            <span className="font-medium">Total Amount:</span>
            <span className="text-lg font-bold">
              ${(amount / 100).toFixed(2)}
            </span>
          </div>

          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              <strong>Secure Payment:</strong> You&apos;ll be redirected to
              Stripe&apos;s secure checkout page to enter your payment details.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing
                ? "Redirecting..."
                : `Pay $${(amount / 100).toFixed(2)}`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
