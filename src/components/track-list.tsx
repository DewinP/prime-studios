"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock, User, ShoppingCart } from "lucide-react";
import { usePlayerStore } from "@/lib/playerStore";
import { useCartStore } from "@/lib/cartStore";
import type { RouterOutputs } from "@/trpc/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LicenseSelectModal } from "@/components/shared/modals/license-select-modal";

type Track = RouterOutputs["track"]["getAll"][number];

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  const { currentTrack, isPlaying, setTrack, setIsPlaying } = usePlayerStore();
  const { addItem, removeItem, items: cartItems } = useCartStore();
  const [licenseModal, setLicenseModal] = useState<{
    open: boolean;
    track: Track | null;
  }>({ open: false, track: null });

  const handleTrackClick = (track: Track) => {
    // If clicking the same track, toggle play/pause
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      // Set new track and start playing
      setTrack({
        id: track.id,
        name: track.name,
        artist: track.artist,
        duration: formatDuration(track.duration),
        coverUrl: track.coverUrl ?? "/logo.png", // Fallback to logo if no cover
        audioUrl: track.audioUrl,
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (tracks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="from-background/80 via-background/60 to-background/40 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br shadow-xl backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5" />
        <div className="relative p-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg font-medium"
          >
            No tracks available yet.
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2
            className="text-foreground mb-2 text-2xl font-bold"
            style={{ fontFamily: "alfarn-2" }}
          >
            {tracks.length} Tracks Available
          </h2>
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" />
        </motion.div>

        <Table className="w-full table-fixed overflow-hidden rounded-xl border-white/10">
          <TableHeader className="border-white/10 bg-white/5 transition-colors hover:bg-white/10">
            <TableRow>
              <TableHead className="text-muted-foreground w-12 font-semibold">
                #
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                Track
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                Artist
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                Duration
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                Tags
              </TableHead>
              <TableHead className="text-muted-foreground w-16 text-right font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-hidden">
            <AnimatePresence>
              {tracks.map((track, index) => {
                const isCurrentTrack = currentTrack?.id === track.id;
                const isTrackPlaying = isCurrentTrack && isPlaying;

                return (
                  <motion.tr
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    className={`group cursor-pointer border border-white/5 transition-all duration-300 ${
                      isCurrentTrack ? "selected" : ""
                    }`}
                    onClick={() => handleTrackClick(track)}
                  >
                    {/* Track Number */}
                    <TableCell className="text-muted-foreground p-5 font-medium">
                      <motion.div
                        className="flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-sm">{index + 1}</span>
                      </motion.div>
                    </TableCell>

                    {/* Track Info */}
                    <TableCell className="overflow-x-hidden pl-6 font-medium">
                      <div className="flex items-center space-x-3">
                        {/* Cover Art */}
                        <motion.div
                          className="relative flex-shrink-0"
                          whileHover={{ rotate: 5, scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/20 shadow-md">
                            <Image
                              src={track.coverUrl ?? "/logo.png"}
                              alt={track.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            {isCurrentTrack && isTrackPlaying && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                              >
                                <motion.div
                                  animate={{
                                    rotate: 360,
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                >
                                  {isTrackPlaying ? (
                                    <Pause className="h-4 w-4 text-white" />
                                  ) : (
                                    <Play className="ml-0.5 h-4 w-4 text-white" />
                                  )}
                                </motion.div>
                              </motion.div>
                            )}
                          </div>

                          {/* Pulse animation for current track */}
                          {isCurrentTrack && (
                            <motion.div
                              className="absolute inset-0 rounded-lg border-2 border-yellow-500/30"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>

                        {/* Title and Description */}
                        <div className="min-w-0 flex-1">
                          <motion.div
                            className="text-foreground truncate font-medium"
                            style={{ fontFamily: "alfarn-2" }}
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            {track.name}
                          </motion.div>
                          {track.description && (
                            <div className="text-muted-foreground/70 truncate text-xs">
                              {track.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Artist */}
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span className="text-sm">{track.artist}</span>
                      </div>
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">
                          {formatDuration(track.duration)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Tags */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            variant="secondary"
                            className="border-gray-500/30 bg-gray-500/10 text-xs text-gray-300 transition-colors hover:bg-gray-500/20"
                          >
                            Hip Hop
                          </Badge>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            variant="outline"
                            className="border-blue-500/30 bg-blue-500/10 text-xs text-blue-300 transition-colors hover:bg-blue-500/20"
                          >
                            Trap
                          </Badge>
                        </motion.div>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 text-right">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex justify-end"
                      >
                        {/* Cart Button */}
                        {(() => {
                          const trackCartItems = cartItems.filter(
                            (item) => item.trackId === track.id,
                          );
                          const isInCart = trackCartItems.length > 0;

                          return (
                            <div className="relative">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant={isInCart ? "default" : "ghost"}
                                    className={`h-8 w-8 rounded-full border transition-all duration-200 ${
                                      isInCart
                                        ? "bg-primary border-primary text-primary-foreground hover:bg-primary/90"
                                        : "text-muted-foreground hover:text-foreground border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      if (isInCart) {
                                        // Remove from cart
                                        const cartItem = trackCartItems[0];
                                        if (cartItem) {
                                          removeItem(
                                            cartItem.trackId,
                                            cartItem.licenseType,
                                          );
                                        }
                                      } else {
                                        // Add to cart
                                        const prices = track.prices || [];
                                        if (prices.length === 1 && prices[0]) {
                                          addItem({
                                            trackId: track.id,
                                            trackName: track.name,
                                            artist: track.artist,
                                            licenseType: prices[0].licenseType,
                                            price: prices[0].price,
                                            stripePriceId:
                                              prices[0].stripePriceId,
                                            coverUrl:
                                              track.coverUrl ?? undefined,
                                          });
                                        } else if (prices.length > 1) {
                                          setLicenseModal({
                                            open: true,
                                            track,
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {isInCart
                                      ? "Remove from Cart"
                                      : "Add to Cart"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          );
                        })()}
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
        {/* License Select Modal */}
        {licenseModal.open && licenseModal.track && (
          <LicenseSelectModal
            open={licenseModal.open}
            onClose={() => setLicenseModal({ open: false, track: null })}
            prices={licenseModal.track.prices?.filter(Boolean) || []}
            onSelect={(selected) => {
              const track = licenseModal.track;
              if (track) {
                useCartStore.getState().addItem({
                  trackId: track.id,
                  trackName: track.name,
                  artist: track.artist,
                  licenseType: selected.licenseType,
                  price: selected.price,
                  stripePriceId: selected.stripePriceId,
                  coverUrl: track.coverUrl ?? undefined,
                });
              }
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
