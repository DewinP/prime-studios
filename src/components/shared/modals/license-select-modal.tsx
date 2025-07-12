"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserAuth } from "@/lib/use-user-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LicensePrice {
  licenseType: string;
  price: number;
  stripePriceId: string;
}

interface LicenseSelectModalProps {
  open: boolean;
  onClose: () => void;
  prices: LicensePrice[];
  onSelect: (license: LicensePrice) => void;
  title?: string;
  currentLicense?: string;
  trackName?: string;
  artist?: string;
  coverUrl?: string | null | undefined;
}

export function LicenseSelectModal({
  open,
  onClose,
  prices,
  onSelect,
  title = "Select a License",
  currentLicense,
  trackName,
  artist,
  coverUrl,
}: LicenseSelectModalProps) {
  const { isAuthenticated } = useUserAuth();
  const router = useRouter();

  const handleNegotiatePrice = () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to negotiate the price");
      router.push("/auth/login");
      onClose();
      return;
    }

    // TODO: Implement negotiate price functionality for authenticated users
    toast.info("Negotiate price feature coming soon!");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border min-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Track Info Section */}
          {(trackName ?? artist ?? coverUrl) && (
            <div className="border-border mb-4 flex items-center gap-4 border-b pb-4">
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={trackName ?? "Track Cover"}
                  width={64}
                  height={64}
                  className="border-border h-16 w-16 rounded-lg border object-cover shadow"
                />
              )}
              <div className="flex min-w-0 flex-col">
                {trackName && (
                  <span className="text-foreground truncate text-2xl font-bold">
                    {trackName}
                  </span>
                )}
                {artist && (
                  <span className="text-primary truncate text-base font-semibold">
                    {artist}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* License Options */}
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            {prices.map((price) => {
              const isSelected = price.licenseType === currentLicense;
              // Subtitle for each license type
              let subtitle = "";
              if (price.licenseType.toLowerCase().includes("mp3"))
                subtitle = "MP3";
              if (
                price.licenseType.toLowerCase().includes("wav") &&
                price.licenseType.toLowerCase().includes("trackout")
              )
                subtitle = "WAV, MP3 & STEMS";
              else if (price.licenseType.toLowerCase().includes("wav"))
                subtitle = "WAV & MP3";
              if (price.licenseType.toLowerCase().includes("unlimited"))
                subtitle = "WAV, MP3 & STEMS";
              if (price.licenseType.toLowerCase().includes("exclusive"))
                subtitle = price.price > 0 ? "EXCLUSIVE" : "MAKE AN OFFER";

              // Special card for exclusive
              if (price.licenseType.toLowerCase().includes("exclusive")) {
                if (price.price > 0) {
                  // Show price as usual
                  return (
                    <Button
                      key={price.licenseType}
                      tabIndex={0}
                      aria-pressed={isSelected}
                      className={`group relative flex h-60 w-full flex-col items-center justify-between rounded-2xl border-2 p-6 text-left shadow-md transition-all duration-150 ${
                        isSelected
                          ? "border-primary from-primary/10 to-background ring-primary bg-gradient-to-br ring-2"
                          : "border-border bg-background hover:border-primary/60 hover:scale-105 hover:shadow-lg"
                      } focus:ring-primary/60 focus:ring-2 focus:outline-none`}
                      onClick={() => {
                        onSelect(price);
                        onClose();
                      }}
                    >
                      <span className="bg-primary/20 text-primary mb-4 rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase">
                        {price.licenseType.replace(/_/g, " ")}
                      </span>
                      <div className="flex flex-1 items-center justify-center">
                        <span className="text-foreground text-3xl leading-none font-extrabold drop-shadow-sm">
                          $
                          {Number(price.price / 100).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <span className="text-muted-foreground mt-2 text-sm font-medium">
                        {subtitle}
                      </span>
                      {isSelected && (
                        <span className="text-primary absolute right-4 bottom-4">
                          <svg
                            width="28"
                            height="28"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="12"
                              fill="currentColor"
                              className="opacity-20"
                            />
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 13l3 3 7-7"
                            />
                          </svg>
                        </span>
                      )}
                    </Button>
                  );
                } else {
                  // Show make an offer
                  return (
                    <div
                      key={price.licenseType}
                      className="bg-muted/80 border-primary/40 relative flex h-60 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center shadow-md"
                    >
                      <span className="text-primary mb-2 text-xs font-bold tracking-widest uppercase">
                        {price.licenseType.replace(/_/g, " ")}
                      </span>
                      <span className="text-foreground mb-2 text-5xl font-bold">
                        ~
                      </span>
                      <span className="text-muted-foreground mb-2 text-sm">
                        {subtitle}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Contact us to negotiate
                      </span>
                    </div>
                  );
                }
              }

              return (
                <Button
                  key={price.licenseType}
                  tabIndex={0}
                  aria-pressed={isSelected}
                  className={`group relative flex h-60 w-full flex-col items-center justify-between rounded-2xl border-2 p-6 text-left shadow-md transition-all duration-150 ${
                    isSelected
                      ? "border-primary from-primary/10 to-background ring-primary bg-gradient-to-br ring-2"
                      : "border-border bg-background hover:border-primary/60 hover:scale-105 hover:shadow-lg"
                  } focus:ring-primary/60 focus:ring-2 focus:outline-none`}
                  onClick={() => {
                    onSelect(price);
                    onClose();
                  }}
                >
                  {/* License type badge */}
                  <span className="bg-primary/20 text-primary mb-4 rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase">
                    {price.licenseType.replace(/_/g, " ")}
                  </span>
                  {/* Price */}
                  <div className="flex flex-1 items-center justify-center">
                    <span className="text-foreground text-3xl leading-none font-extrabold drop-shadow-sm">
                      $
                      {Number(price.price / 100).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {/* Subtitle */}
                  <span className="text-muted-foreground mt-2 text-sm font-medium">
                    {subtitle}
                  </span>
                  {/* Checkmark for selected */}
                  {isSelected && (
                    <span className="text-primary absolute right-4 bottom-4">
                      <svg
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="12"
                          fill="currentColor"
                          className="opacity-20"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 13l3 3 7-7"
                        />
                      </svg>
                    </span>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Negotiate the price button for exclusive (optional) */}
          {prices.some((p) =>
            p.licenseType.toLowerCase().includes("exclusive"),
          ) && (
            <div className="mt-8 flex flex-col items-center">
              <span className="text-muted-foreground mb-2">
                Or, you can also:
              </span>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 text-base font-bold shadow transition"
                onClick={handleNegotiatePrice}
              >
                ✦ Negotiate the price
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-border/50 flex justify-end gap-3 border-t pt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border text-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
