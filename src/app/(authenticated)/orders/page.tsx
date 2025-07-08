"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Calendar,
  DollarSign,
  Music,
  Download,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const {
    data: orders,
    isLoading: ordersLoading,
    isError,
  } = api.order.getOrderHistory.useQuery();

  if (ordersLoading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Package className="text-muted-foreground h-8 w-8 animate-pulse" />
          <div className="text-muted-foreground">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-2 text-2xl font-bold">Error Loading Orders</h2>
          <p className="text-muted-foreground mb-4">
            There was an error loading your orders. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="mb-2 text-3xl font-bold">My Orders</h1>
        </div>

        <div className="py-12 text-center">
          <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="mb-2 text-2xl font-bold">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t made any purchases yet.
          </p>
          <Button asChild>
            <Link href="/">Browse Tracks</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="mb-2 text-3xl font-bold">My Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Order #{order.orderNumber}
                </CardTitle>
                <Badge
                  variant={
                    order.status === "paid"
                      ? "default"
                      : order.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {order.status}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Total</span>
                <div className="flex items-center gap-1 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  {(order.total / 100).toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Music className="h-4 w-4" />
                  {order.items.length} track
                  {order.items.length !== 1 ? "s" : ""}
                </div>

                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="font-medium">
                      {item.track?.name ?? "Track"}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {item.licenseType} License
                    </div>
                  </div>
                ))}

                {order.items.length > 2 && (
                  <div className="text-muted-foreground text-xs">
                    +{order.items.length - 2} more tracks
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button size="sm" variant="ghost" className="text-blue-600">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
