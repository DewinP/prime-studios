"use client";

import { useCartStore } from "@/lib/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, getTotal, clearCart, getItemCount } =
    useCartStore();

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    alert("Checkout functionality coming soon!");
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex-col justify-center p-10">
        <div className="mx-auto max-w-2xl text-center">
          <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-gray-400">
            Add some tracks to your cart to get started!
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              Browse Tracks
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "alfarn-2" }}>
            Shopping Cart
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">
              {getItemCount()} item{getItemCount() !== 1 ? "s" : ""}
            </span>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-500 hover:text-red-600"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-3 lg:col-span-2">
            {items.map((item) => (
              <Card key={item.id} className="bg-card/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div className="min-w-0 flex-1">
                      <h3
                        className="truncate text-sm font-semibold"
                        style={{ fontFamily: "alfarn-2" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400">{item.artist}</p>
                      <p className="text-primary text-sm font-semibold">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 sticky top-4">
              <CardHeader>
                <CardTitle style={{ fontFamily: "alfarn-2" }}>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(getTotal() * 0.1).toFixed(2)}</span>
                </div>
                <hr className="border-gray-700" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${(getTotal() * 1.1).toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="bg-primary hover:bg-primary/90 w-full"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
