"use client";

import { AdminTrackList } from "@/components/admin-track-list";
import { UploadTrackModal } from "@/components/shared/modals/upload-track-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import type { UploadTrackData } from "@/components/shared/modals/upload-track-modal";

export default function TracksPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: sessionWithUser, isLoading } =
    api.auth.getSessionWithUser.useQuery();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !sessionWithUser?.user?.isAdmin) {
      router.push("/auth/login");
    }
  }, [sessionWithUser, isLoading, router]);

  const handleUploadTrack = async (trackData: UploadTrackData) => {
    try {
      await utils.track.getAllByAdmin.invalidate();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Failed to handle track upload:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-10">
        <div className="bg-muted h-8 w-64 animate-pulse rounded" />
        <div className="bg-muted mt-4 h-4 w-96 animate-pulse rounded" />
      </div>
    );
  }

  const user = sessionWithUser?.user;

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
      <AdminTrackList />
      <UploadTrackModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUploadTrack}
      />
    </div>
  );
}
