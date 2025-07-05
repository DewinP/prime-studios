"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import type { Payment } from "@prisma/client";

export function PaymentHistory() {
  const {
    data: payments,
    isLoading,
    error,
  } = api.payment.getPaymentHistory.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Loading your payment history...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Error loading payment history: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>No payments found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Your recent payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment: Payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  ${(payment.amount / 100).toFixed(2)}{" "}
                  {payment.currency.toUpperCase()}
                </p>
                <p className="text-muted-foreground text-sm">
                  {payment.description ?? "Payment"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge
                variant={
                  payment.status === "succeeded"
                    ? "default"
                    : payment.status === "failed"
                      ? "destructive"
                      : "secondary"
                }
              >
                {payment.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
