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

export function OrderHistory() {
  const {
    data: orders,
    isLoading,
    error,
  } = api.order.getOrderHistory.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Loading your order history...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            Error loading order history: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>No orders found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>Your recent orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">#{order.orderNumber}</p>
                  <Badge
                    variant={
                      order.status === "paid"
                        ? "default"
                        : order.status === "failed"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {order.billingEmail} • {order.items.length} item
                  {order.items.length !== 1 ? "s" : ""}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${(order.total / 100).toFixed(2)}{" "}
                  {order.currency.toUpperCase()}
                </p>
                <p className="text-muted-foreground text-xs">
                  {order.items.map((item) => item.licenseType).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
