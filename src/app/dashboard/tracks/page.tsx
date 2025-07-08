"use client";

import { AdminTrackList } from "@/components/admin-track-list";
import { UploadTrackModal } from "@/components/shared/modals/upload-track-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function TracksPage() {
  const utils = api.useUtils();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadTrack = async () => {
    try {
      await utils.track.getAllByAdmin.invalidate();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Failed to handle track upload:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10">
      <div className="mb-8">
        <h1
          className="text-gradient-brand text-3xl font-bold"
          style={{ fontFamily: "alfarn-2" }}
        >
          Tracks
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse and manage tracks here.
        </p>
      </div>
      <div className="mb-8">
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="hover:shadow-glow-brand px-6 py-3 transition-all duration-200"
        >
          + Add New Track
        </Button>
      </div>
      <AdminTrackList />
      <UploadTrackModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUploadTrack}
      />
    </div>
  );
}
