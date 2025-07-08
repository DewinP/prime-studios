"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Calendar,
  DollarSign,
  Music,
  User,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

import type { RouterOutputs } from "@/trpc/react";

type Order = RouterOutputs["order"]["getOrderById"];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const {
    data: order,
    isLoading,
    isError,
  } = api.order.getOrderById.useQuery({ orderId }, { enabled: !!orderId });

  const { data: paymentDetails, isLoading: paymentLoading } =
    api.order.getPaymentDetails.useQuery(
      { orderId },
      { enabled: !!orderId && !!order?.stripePaymentId },
    );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The order you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Button asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "refunded":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      case "refunded":
        return "bg-orange-500/20 text-orange-700 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
      case "american express":
        return "💳";
      case "discover":
        return "💳";
      default:
        return "💳";
    }
  };

  const getCardBrandName = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
      case "american express":
        return "American Express";
      case "discover":
        return "Discover";
      default:
        return brand || "Card";
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-muted-foreground mt-1">
                Created on{" "}
                {order.createdAt
                  ? new Intl.DateTimeFormat("en-US", {
                      dateStyle: "full",
                      timeStyle: "short",
                    }).format(new Date(order.createdAt))
                  : "Unknown date"}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(order.status)} px-4 py-2 text-sm capitalize`}
          >
            {getStatusIcon(order.status)}
            <span className="ml-2">{order.status}</span>
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Music className="h-6 w-6" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card hover:bg-muted/50 flex items-center justify-between rounded-xl border p-6 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="from-primary/20 to-primary/10 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br">
                        <Music className="text-primary h-8 w-8" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {item.track?.name ?? "Unknown Track"}
                        </div>
                        <div className="text-muted-foreground">
                          by {item.track?.artist ?? "Unknown Artist"}
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {item.licenseType.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        ${(item.unitPrice / 100).toFixed(2)}
                      </div>
                      <div className="text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${(order.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>${(order.tax / 100).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${(order.total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              {paymentDetails && (
                <div className="border-t pt-4">
                  <div className="text-muted-foreground mb-3 text-sm font-medium">
                    Payment Method
                  </div>
                  <div className="bg-muted/30 flex items-center gap-3 rounded-lg border p-4">
                    <span className="text-2xl">
                      {getCardBrandIcon(paymentDetails.brand ?? "")}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {getCardBrandName(paymentDetails.brand ?? "")} ••••{" "}
                        {paymentDetails.last4}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Expires {paymentDetails.expMonth}/
                        {paymentDetails.expYear}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentLoading && (
                <div className="border-t pt-4">
                  <div className="text-muted-foreground mb-3 text-sm font-medium">
                    Payment Method
                  </div>
                  <div className="bg-muted/30 flex items-center gap-3 rounded-lg border p-4">
                    <div className="bg-muted-foreground/20 h-6 w-6 animate-pulse rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-muted-foreground/20 h-4 w-32 animate-pulse rounded"></div>
                      <div className="bg-muted-foreground/20 h-3 w-20 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              )}

              {order.stripePaymentId && (
                <div className="border-t pt-4">
                  <div className="text-muted-foreground font-mono text-xs">
                    Payment ID: {order.stripePaymentId}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                    <Mail className="text-muted-foreground h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{order.billingEmail}</div>
                    <div className="text-muted-foreground text-sm">
                      Billing Email
                    </div>
                  </div>
                </div>

                {order.billingName && (
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                      <User className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{order.billingName}</div>
                      <div className="text-muted-foreground text-sm">
                        Billing Name
                      </div>
                    </div>
                  </div>
                )}

                {order.user ? (
                  <div className="border-t pt-4">
                    <div className="text-muted-foreground mb-3 text-sm font-medium">
                      Registered User
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <User className="text-primary h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{order.user.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {order.user.email}
                        </div>
                        <div className="text-muted-foreground font-mono text-xs">
                          ID: {order.user.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <div className="text-muted-foreground text-sm">
                      Guest Order
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
