"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Play,
  Pause,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  User,
} from "lucide-react";
import { usePlayerStore } from "@/lib/playerStore";
import { useState } from "react";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Track = RouterOutputs["track"]["getAllByAdmin"][number];

// Add license options
const LICENSE_OPTIONS = [
  { label: "MP3 Lease", value: "mp3_lease" },
  { label: "WAV Lease", value: "wav_lease" },
  { label: "WAV Trackout Lease", value: "wav_trackout_lease" },
  { label: "Unlimited Lease", value: "unlimited_lease" },
  { label: "Exclusive", value: "exclusive" },
];

export function AdminTrackList() {
  const { currentTrack, isPlaying, setTrack, setIsPlaying } = usePlayerStore();
  const utils = api.useUtils();

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    status: "draft" as "draft" | "published",
  });

  // State for delete
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Add license options
  const [editPrices, setEditPrices] = useState<
    { id?: string; licenseType: string; price: number; displayPrice: string }[]
  >([]);

  // Fetch all tracks using admin query (includes drafts and published)
  const {
    data: tracks = [],
    isLoading: tracksLoading,
    error,
  } = api.track.getAllByAdmin.useQuery();

  // Mutations
  const updateTrack = api.track.update.useMutation({
    onSuccess: async () => {
      await utils.track.getAllByAdmin.invalidate();
      setIsEditModalOpen(false);
      setEditingTrack(null);
    },
  });

  const deleteTrack = api.track.delete.useMutation({
    onSuccess: async () => {
      await utils.track.getAllByAdmin.invalidate();
      setIsDeleteConfirmOpen(false);
      setDeletingTrack(null);
    },
  });

  // Handlers
  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setTrack({
        id: track.id,
        name: track.name,
        artist: track.artist,
        duration: formatDuration(track.duration),
        coverUrl: track.coverUrl ?? "/logo.png",
        audioUrl: track.audioUrl,
      });
    }
  };

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setEditForm({
      name: track.name,
      status: track.status as "draft" | "published",
    });
    setEditPrices(
      track.prices?.map((p) => ({
        id: p.id,
        licenseType: p.licenseType,
        price: p.price,
        displayPrice: (p.price / 100).toFixed(2),
      })) ?? [],
    );
    setIsEditModalOpen(true);
  };

  const handleEditPriceChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setEditPrices((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  const handleAddEditPrice = () => {
    setEditPrices((prev) => [
      ...prev,
      { licenseType: "mp3_lease", price: 0, displayPrice: "0.00" },
    ]); // price is stored in cents
  };

  const handleRemoveEditPrice = (index: number) => {
    setEditPrices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveEdit = () => {
    if (!editingTrack) return;
    updateTrack.mutate({
      id: editingTrack.id,
      name: editForm.name,
      status: editForm.status,
      prices: editPrices.map(({ displayPrice, ...price }) => price),
    });
  };

  const handleDeleteTrack = (track: Track) => {
    setDeletingTrack(track);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingTrack) return;
    deleteTrack.mutate({ id: deletingTrack.id });
  };

  // Formatters
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // UI
  if (tracksLoading) {
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
            Loading tracks...
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="from-background/80 via-background/60 to-background/40 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br shadow-xl backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10" />
        <div className="relative p-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-destructive text-lg font-medium"
          >
            Error loading tracks: {error.message}
          </motion.div>
        </div>
      </motion.div>
    );
  }

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
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2
          className="text-foreground mb-2 text-2xl font-bold"
          style={{ fontFamily: "alfarn-2" }}
        >
          {tracks.length} Track{tracks.length !== 1 ? "s" : ""} Available
        </h2>
        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="from-background/80 via-background/60 to-background/40 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br shadow-xl backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/3 via-orange-500/3 to-red-500/3" />

        <div className="relative">
          {/* Edit Track Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Edit Track
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="track-name" className="text-foreground">
                    Track Name
                  </Label>
                  <Input
                    id="track-name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="track-status" className="text-foreground">
                    Status
                  </Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value: "draft" | "published") =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Price Options */}
                <div>
                  <Label className="text-foreground">Price Options *</Label>
                  <div className="space-y-2">
                    {editPrices.map((p, i) => (
                      <div key={p.id || i} className="flex items-center gap-2">
                        <Select
                          value={p.licenseType}
                          onValueChange={(val) =>
                            handleEditPriceChange(i, "licenseType", val)
                          }
                        >
                          <SelectTrigger className="bg-background border-border text-foreground w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {LICENSE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={p.displayPrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            const dollarAmount = parseFloat(value) || 0;
                            const centsAmount = Math.round(dollarAmount * 100);
                            handleEditPriceChange(i, "displayPrice", value);
                            handleEditPriceChange(i, "price", centsAmount);
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            const dollarAmount = parseFloat(value) || 0;
                            const formattedValue = dollarAmount.toFixed(2);
                            handleEditPriceChange(
                              i,
                              "displayPrice",
                              formattedValue,
                            );
                          }}
                          className="bg-background border-border text-foreground w-28"
                          placeholder="Price ($)"
                          required
                        />
                        {editPrices.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveEditPrice(i)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddEditPrice}
                      className="mt-2"
                    >
                      + Add Price Option
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-primary text-primary-foreground"
                    disabled={updateTrack.isPending}
                  >
                    Save Changes
                  </Button>
                </div>
                {updateTrack.error && (
                  <div className="text-destructive mt-2 text-sm">
                    {updateTrack.error.message}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={isDeleteConfirmOpen}
            onOpenChange={setIsDeleteConfirmOpen}
          >
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Delete Track
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-foreground">
                  Are you sure you want to delete <b>{deletingTrack?.name}</b>?
                  This action cannot be undone.
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    className="bg-destructive text-destructive-foreground"
                    disabled={deleteTrack.isPending}
                  >
                    Delete
                  </Button>
                </div>
                {deleteTrack.error && (
                  <div className="text-destructive mt-2 text-sm">
                    {deleteTrack.error.message}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Table */}
          <Table>
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
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold">
                  Created At
                </TableHead>
                <TableHead className="text-muted-foreground w-16 text-right font-semibold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.2 },
                      }}
                      className={`group cursor-pointer border-white/5 transition-all duration-300 ${
                        isCurrentTrack
                          ? "border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10"
                          : "border-l-4 border-l-transparent hover:bg-white/5"
                      }`}
                      onClick={() => handleTrackClick(track)}
                    >
                      {/* Track Number */}
                      <TableCell className="text-muted-foreground font-medium">
                        <motion.div
                          className="flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isCurrentTrack ? (
                            <motion.div
                              animate={isTrackPlaying ? { rotate: 360 } : {}}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                            >
                              {isTrackPlaying ? (
                                <Pause className="h-3 w-3 text-white" />
                              ) : (
                                <Play className="ml-0.5 h-3 w-3 text-white" />
                              )}
                            </motion.div>
                          ) : (
                            <span className="text-sm">{index + 1}</span>
                          )}
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
                              <img
                                src={track.coverUrl ?? "/logo.png"}
                                alt={track.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              {isCurrentTrack && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                >
                                  <motion.div
                                    animate={
                                      isTrackPlaying ? { rotate: 360 } : {}
                                    }
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

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={
                            track.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            track.status === "published"
                              ? "border border-green-500/30 bg-green-500/20 text-green-400"
                              : "border border-yellow-500/30 bg-yellow-500/20 text-yellow-400"
                          }
                        >
                          {track.status}
                        </Badge>
                      </TableCell>

                      {/* Created At */}
                      <TableCell className="text-muted-foreground">
                        <span className="text-sm">
                          {formatDate(track.createdAt)}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full border border-white/20 bg-white/10 transition-all duration-200 hover:border-white/40 hover:bg-white/20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-card border-border"
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTrack(track);
                              }}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTrack(track);
                              }}
                              className="text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
