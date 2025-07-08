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
  FileText,
} from "lucide-react";
import { api } from "@/trpc/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { LicenseSelectModal } from "@/components/shared/modals/license-select-modal";
import { useAuth } from "@/lib/auth-context";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();
  const { session } = useAuth();
  const [licenseModal, setLicenseModal] = useState<{
    open: boolean;
    trackId: string;
    currentLicense: string;
    trackName: string;
    artist: string;
    coverUrl: string | null;
  } | null>(null);
  const [licenseReviewModal, setLicenseReviewModal] = useState<{
    open: boolean;
    trackName: string;
    artist: string;
    licenseType: string;
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
    const item = items.find(
      (item) => item.trackId === trackId && item.licenseType === currentLicense,
    );
    if (item) {
      setLicenseModal({
        open: true,
        trackId,
        currentLicense,
        trackName: item.trackName,
        artist: item.artist,
        coverUrl: item.coverUrl ?? null,
      });
    }
  };

  const handleLicenseChange = (license: {
    licenseType: string;
    price: number;
    stripePriceId: string;
  }) => {
    if (!licenseModal) return;

    const { trackId, currentLicense } = licenseModal;
    const oldItem = items.find(
      (item) => item.trackId === trackId && item.licenseType === currentLicense,
    );

    if (oldItem) {
      removeItem(trackId, currentLicense);
      useCartStore.getState().addItem({
        trackId: oldItem.trackId,
        trackName: oldItem.trackName,
        artist: oldItem.artist,
        licenseType: license.licenseType,
        price: license.price,
        stripePriceId: license.stripePriceId,
        coverUrl: oldItem.coverUrl,
      });
    }

    setLicenseModal(null);
  };

  const createOrderMutation = api.order.createOrder.useMutation();
  const createGuestOrderMutation = api.order.createGuestOrder.useMutation();

  const handleCheckout = async () => {
    try {
      // Get user info if logged in
      const user = session?.user;

      // Map items with correct trackPriceId
      const orderItems = items.map((item) => {
        // Find the matching track price for this item
        const matchingPrice = allPrices?.find(
          (p) =>
            p.trackId === item.trackId && p.licenseType === item.licenseType,
        );

        if (!matchingPrice) {
          throw new Error(
            `No price found for track ${item.trackName} with license ${item.licenseType}`,
          );
        }

        return {
          trackId: item.trackId,
          trackPriceId: matchingPrice.id,
          licenseType: item.licenseType,
          quantity: 1,
          unitPrice: item.price,
          stripePriceId: item.stripePriceId,
        };
      });

      const orderData = {
        items: orderItems,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/cart`,
      };

      // Use appropriate mutation based on authentication status
      const result = user
        ? await createOrderMutation.mutateAsync(orderData)
        : await createGuestOrderMutation.mutateAsync(orderData);

      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // You could add a toast notification here
      alert("Failed to create order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
    <div className="mx-auto min-h-full max-w-4xl px-4 py-16">
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
                allPrices?.filter((p) => p.trackId === item.trackId) ?? [];

              return (
                <motion.div
                  key={item.trackId + item.licenseType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                      {/* WAV Lease Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <Badge
                          variant="secondary"
                          className="border-blue-500/30 bg-blue-500/20 text-xs font-medium text-blue-300"
                        >
                          WAV Lease
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Cover Art */}
                        <div className="relative flex-shrink-0">
                          <Image
                            src={item.coverUrl ?? "/logo.png"}
                            alt={item.trackName}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg border border-white/20 object-cover shadow-md"
                          />
                          <div className="bg-primary absolute -right-0.5 -bottom-0.5 rounded-full p-0.5">
                            <Music className="text-primary-foreground h-2 w-2" />
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-foreground truncate text-base font-semibold">
                                {item.trackName}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                by {item.artist}
                              </p>
                            </div>

                            {/* License and Actions */}
                            <div className="flex w-64 items-center justify-center">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() =>
                                    setLicenseReviewModal({
                                      open: true,
                                      trackName: item.trackName,
                                      artist: item.artist,
                                      licenseType: item.licenseType,
                                    })
                                  }
                                  className="text-muted-foreground hover:text-primary h-6 px-2 text-xs"
                                >
                                  <FileText className="mr-1 h-3 w-3" />
                                  Review License
                                </Button>

                                {trackPrices.length > 1 ? (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() =>
                                      handleChangeLicense(
                                        item.trackId,
                                        item.licenseType,
                                      )
                                    }
                                    className="text-muted-foreground hover:text-primary h-6 px-2 text-xs"
                                  >
                                    Change License
                                  </Button>
                                ) : (
                                  <div className="w-12" />
                                )}
                              </div>
                            </div>

                            {/* Price and Remove */}
                            <div className="ml-8 flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-foreground text-lg font-bold">
                                  ${(item.price / 100).toFixed(2)}
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeItem(item.trackId, item.licenseType)
                                }
                                className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                aria-label="Remove from cart"
                              >
                                <Trash2 className="h-4 w-4" />
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
        <LicenseSelectModal
          open={licenseModal.open}
          onClose={() => setLicenseModal(null)}
          prices={
            allPrices?.filter((p) => p.trackId === licenseModal.trackId) ?? []
          }
          onSelect={handleLicenseChange}
          title="Change License Type"
          currentLicense={licenseModal.currentLicense}
          trackName={licenseModal.trackName}
          artist={licenseModal.artist}
          coverUrl={licenseModal.coverUrl}
        />
      )}

      {/* License Review Modal */}
      {licenseReviewModal && (
        <Dialog
          open={licenseReviewModal.open}
          onOpenChange={() => setLicenseReviewModal(null)}
        >
          <DialogContent className="bg-card border-border max-h-[80vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl font-bold">
                License Agreement Preview
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Track Info */}
              <div className="border-border/50 bg-background/50 rounded-lg border p-4">
                <h3 className="text-foreground mb-2 font-semibold">
                  {licenseReviewModal.trackName}
                </h3>
                <p className="text-muted-foreground text-sm">
                  by {licenseReviewModal.artist}
                </p>
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary border-primary/30 mt-2"
                >
                  {licenseReviewModal.licenseType.replace(/_/g, " ")}
                </Badge>
              </div>

              {/* License Agreement */}
              <div className="space-y-4">
                <h4 className="text-foreground text-lg font-semibold">
                  License Agreement
                </h4>
                <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                  <p>
                    <strong>1. GRANT OF LICENSE</strong>
                  </p>
                  <p>
                    Subject to the terms and conditions of this Agreement, Prime
                    Studios NYC (&quot;Licensor&quot;) hereby grants to you
                    (&quot;Licensee&quot;) a non-exclusive, non-transferable
                    license to use the musical composition &quot;
                    {licenseReviewModal.trackName}&quot; (the &quot;Work&quot;)
                    in accordance with the terms specified herein.
                  </p>

                  <p>
                    <strong>
                      2. LICENSE TYPE:{" "}
                      {licenseReviewModal.licenseType
                        .replace(/_/g, " ")
                        .toUpperCase()}
                    </strong>
                  </p>
                  <p>
                    This license grants you the following rights based on your
                    selected license type:
                  </p>

                  {licenseReviewModal.licenseType === "mp3_lease" && (
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Unlimited commercial use in one project</li>
                      <li>MP3 format delivery</li>
                      <li>Valid for one commercial release</li>
                      <li>
                        Credit required: &quot;Music by Prime Studios NYC&quot;
                      </li>
                    </ul>
                  )}

                  {licenseReviewModal.licenseType === "wav_lease" && (
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Unlimited commercial use in one project</li>
                      <li>WAV format delivery (high quality)</li>
                      <li>Valid for one commercial release</li>
                      <li>
                        Credit required: &quot;Music by Prime Studios NYC&quot;
                      </li>
                      <li>Includes stems for remixing</li>
                    </ul>
                  )}

                  {licenseReviewModal.licenseType === "wav_trackout_lease" && (
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Unlimited commercial use in one project</li>
                      <li>WAV format delivery with individual trackouts</li>
                      <li>Valid for one commercial release</li>
                      <li>
                        Credit required: &quot;Music by Prime Studios NYC&quot;
                      </li>
                      <li>Full mixing control with individual tracks</li>
                    </ul>
                  )}

                  {licenseReviewModal.licenseType === "unlimited_lease" && (
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Unlimited commercial use in unlimited projects</li>
                      <li>WAV format delivery</li>
                      <li>No expiration date</li>
                      <li>
                        Credit required: &quot;Music by Prime Studios NYC&quot;
                      </li>
                      <li>Includes stems for remixing</li>
                    </ul>
                  )}

                  {licenseReviewModal.licenseType === "exclusive" && (
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Exclusive rights to the composition</li>
                      <li>WAV format delivery with all stems</li>
                      <li>No expiration date</li>
                      <li>No credit required</li>
                      <li>Full ownership transfer</li>
                      <li>Licensor cannot sell to others</li>
                    </ul>
                  )}

                  <p>
                    <strong>3. RESTRICTIONS</strong>
                  </p>
                  <p>
                    Licensee may not: (a) sell, lease, or transfer the Work to
                    any third party; (b) use the Work in a manner that violates
                    any applicable laws or regulations; (c) claim ownership of
                    the Work; or (d) use the Work in projects that promote hate
                    speech, violence, or illegal activities.
                  </p>

                  <p>
                    <strong>4. TERM</strong>
                  </p>
                  <p>
                    This license is effective upon payment and shall continue in
                    perpetuity unless terminated in accordance with the terms
                    herein.
                  </p>

                  <p>
                    <strong>5. TERMINATION</strong>
                  </p>
                  <p>
                    Licensor may terminate this license if Licensee breaches any
                    material term of this Agreement. Upon termination, Licensee
                    must cease all use of the Work and destroy all copies.
                  </p>

                  <p>
                    <strong>6. WARRANTY</strong>
                  </p>
                  <p>
                    Licensor warrants that it has the right to grant this
                    license and that the Work does not infringe upon the rights
                    of any third party.
                  </p>

                  <p>
                    <strong>7. LIMITATION OF LIABILITY</strong>
                  </p>
                  <p>
                    In no event shall Licensor be liable for any indirect,
                    incidental, special, or consequential damages arising out of
                    or relating to this Agreement.
                  </p>

                  <p>
                    <strong>8. GOVERNING LAW</strong>
                  </p>
                  <p>
                    This Agreement shall be governed by and construed in
                    accordance with the laws of the State of New York, United
                    States.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-border/50 flex justify-end gap-3 border-t pt-6">
                <Button
                  variant="outline"
                  onClick={() => setLicenseReviewModal(null)}
                  className="border-border text-foreground"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setLicenseReviewModal(null)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  I Understand
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
