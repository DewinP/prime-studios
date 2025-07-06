"use client";

import { useCartStore } from "@/lib/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  ShoppingCart,
  CreditCard,
  Shield,
  Download,
  Music,
} from "lucide-react";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();
  const [licenseModal, setLicenseModal] = useState<{
    open: boolean;
    trackId: string;
    currentLicense: string;
  } | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  // Get unique track IDs to fetch prices
  const trackIds = [...new Set(items.map((item) => item.trackId))];

  // Fetch prices for all tracks in cart using a single query
  const { data: allPrices } = api.track.getPricesByIds.useQuery(
    { ids: trackIds },
    { enabled: trackIds.length > 0 },
  );

  const handleChangeLicense = (trackId: string, currentLicense: string) => {
    setLicenseModal({ open: true, trackId, currentLicense });
  };

  const handleLicenseChange = (newLicense: string) => {
    if (!licenseModal) return;

    const { trackId, currentLicense } = licenseModal;
    const trackPrices = allPrices?.filter((p: any) => p.trackId === trackId);
    const newPrice = trackPrices?.find(
      (p: any) => p.licenseType === newLicense,
    );

    if (newPrice) {
      // Remove old item and add new one
      const oldItem = items.find(
        (item) =>
          item.trackId === trackId && item.licenseType === currentLicense,
      );
      if (oldItem) {
        removeItem(trackId, currentLicense);
        useCartStore.getState().addItem({
          trackId: oldItem.trackId,
          trackName: oldItem.trackName,
          artist: oldItem.artist,
          licenseType: newLicense,
          price: newPrice.price,
          stripePriceId: newPrice.stripePriceId,
          coverUrl: oldItem.coverUrl,
        });
      }
    }

    setLicenseModal(null);
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/stripe/create-cart-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error ?? "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // You could add a toast notification here
      alert("Failed to create checkout session. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-muted/20 mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full">
            <ShoppingCart className="text-muted-foreground h-12 w-12" />
          </div>
          <h1 className="text-foreground mb-4 text-3xl font-bold">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Start building your collection by browsing our tracks
          </p>
          <Button asChild size="lg">
            <Link href="/">Browse Tracks</Link>
          </Button>
        </motion.div>
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
        {/* Header */}
        <div className="text-center">
          <h1 className="text-foreground mb-2 text-4xl font-bold">Your Cart</h1>
          <p className="text-muted-foreground text-lg">
            {items.length} {items.length === 1 ? "item" : "items"} ready for
            checkout
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item, index) => {
              const trackPrices =
                allPrices?.filter((p: any) => p.trackId === item.trackId) ?? [];

              return (
                <motion.div
                  key={item.trackId + item.licenseType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Cover Art */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.coverUrl ?? "/logo.png"}
                            alt={item.trackName}
                            className="h-20 w-20 rounded-lg border border-white/20 object-cover shadow-lg"
                          />
                          <div className="bg-primary absolute -right-1 -bottom-1 rounded-full p-1">
                            <Music className="text-primary-foreground h-3 w-3" />
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-foreground mb-1 truncate text-xl font-semibold">
                                {item.trackName}
                              </h3>
                              <p className="text-muted-foreground mb-3 text-sm">
                                by {item.artist}
                              </p>

                              {/* License Selection */}
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/20 text-primary border-primary/30"
                                >
                                  {item.licenseType.replace(/_/g, " ")}
                                </Badge>

                                {trackPrices.length > 1 && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() =>
                                      handleChangeLicense(
                                        item.trackId,
                                        item.licenseType,
                                      )
                                    }
                                    className="text-muted-foreground hover:text-primary text-xs"
                                  >
                                    Change License
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-foreground text-2xl font-bold">
                                  ${(item.price / 100).toFixed(2)}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  Instant Download
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeItem(item.trackId, item.licenseType)
                                }
                                className="text-destructive hover:bg-destructive/10"
                                aria-label="Remove from cart"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary and Checkout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="space-y-3">
                  <h3 className="text-foreground text-xl font-semibold">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({items.length} items)
                      </span>
                      <span className="text-foreground font-medium">
                        ${(subtotal / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Processing Fee
                      </span>
                      <span className="text-foreground font-medium">$0.00</span>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">
                          ${(subtotal / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                    <div>
                      <h4 className="mb-1 font-semibold text-green-400">
                        Secure Checkout
                      </h4>
                      <p className="text-sm text-green-300/80">
                        Your payment will be processed securely through Stripe.
                        All transactions are encrypted and protected.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <Download className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                    <div>
                      <h4 className="mb-1 font-semibold text-blue-400">
                        What&apos;s Included
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-300/80">
                        <li>
                          • High-quality audio files (MP3/WAV based on license)
                        </li>
                        <li>• Instant download after payment</li>
                        <li>• License agreement for your selected use</li>
                        <li>• Customer support if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-muted-foreground hover:text-foreground border-white/20"
                  >
                    Clear Cart
                  </Button>

                  <Button
                    onClick={handleCheckout}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Secure Checkout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* License Change Modal */}
      {licenseModal && (
        <Dialog
          open={licenseModal.open}
          onOpenChange={() => setLicenseModal(null)}
        >
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogTitle className="text-foreground mb-4 text-xl font-bold">
              Change License Type
            </DialogTitle>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Select a different license option for this track:
              </p>

              <Select onValueChange={handleLicenseChange}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {allPrices
                    ?.filter((p: any) => p.trackId === licenseModal.trackId)
                    .map((price: any) => (
                      <SelectItem
                        key={price.licenseType}
                        value={price.licenseType}
                      >
                        {price.licenseType.replace(/_/g, " ")} - $
                        {(price.price / 100).toFixed(2)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setLicenseModal(null)}
                  className="border-border text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
