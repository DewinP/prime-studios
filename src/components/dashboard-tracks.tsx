"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadTrackModal } from "./upload-track-modal";
import type { UploadTrackData } from "./upload-track-modal";
import { useUserAuth } from "@/lib/use-user-auth";
import { api } from "@/trpc/react";

interface Track {
  id: string;
  name: string;
  artist: string;
  description: string | null;
  duration: number;
  audioUrl: string;
  coverUrl: string | null;
  status: string;
  plays: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface DashboardTracksProps {
  tracks: Track[];
}

export function DashboardTracks({ tracks }: DashboardTracksProps) {
  const { user } = useUserAuth();
  const utils = api.useUtils();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    status: "draft" as string,
  });

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setEditForm({
      name: track.name,
      status: track.status,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    // TODO: Implement actual API call to update track
    console.log("Saving track:", editingTrack?.id, editForm);
    setIsEditModalOpen(false);
    setEditingTrack(null);
  };

  const handleDeleteTrack = (trackId: string) => {
    // TODO: Implement actual API call to delete track
    console.log("Deleting track:", trackId);
  };

  const handleUploadTrack = async (trackData: UploadTrackData) => {
    try {
      console.log("Track uploaded successfully:", trackData);

      // Invalidate and refetch tracks to show the new track
      await utils.track.getAll.invalidate();

      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Failed to handle track upload:", error);
    }
  };

  return (
    <div className="bg-gradient-dark min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-gradient-brand text-3xl font-bold"
            style={{ fontFamily: "alfarn-2" }}
          >
            Studio Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name ?? user?.email}! Manage your tracks here.
          </p>
        </div>

        {/* Add Track Button - Only show for admins */}
        {user?.isAdmin && (
          <div className="mb-8">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="hover:shadow-glow-brand px-6 py-3 transition-all duration-200"
            >
              + Add New Track
            </Button>
          </div>
        )}

        {/* Tracks List */}
        <Card className="border-border/50 bg-gradient-card shadow-glow border">
          <CardHeader className="border-border/50 border-b">
            <CardTitle className="text-foreground text-lg font-medium">
              Recent Tracks
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-border/50 divide-y">
            {tracks.length === 0 ? (
              <div className="text-muted-foreground px-6 py-8 text-center">
                No tracks found. Create your first track to get started!
              </div>
            ) : (
              tracks.map((track) => (
                <div
                  key={track.id}
                  className="hover:bg-muted/30 flex items-center justify-between px-6 py-4 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="border-border/25 bg-muted/50 flex h-12 w-12 items-center justify-center rounded-lg border">
                      {track.coverUrl ? (
                        <img
                          src={track.coverUrl}
                          alt={track.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground">🎵</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">
                        {track.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {Math.floor(track.duration / 60)}:
                        {(track.duration % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={
                        track.status === "published" ? "default" : "secondary"
                      }
                      className={
                        track.status === "published"
                          ? "border border-green-500/30 bg-green-500/20 text-green-400"
                          : "border border-yellow-500/30 bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {track.status}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {track.plays} plays
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEditTrack(track)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTrack(track.id)}
                          className="text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Edit Track Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Track</DialogTitle>
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
                  onValueChange={(value: string) =>
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
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Track Modal */}
        <UploadTrackModal
          isOpen={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUpload={handleUploadTrack}
        />
      </div>
    </div>
  );
}
