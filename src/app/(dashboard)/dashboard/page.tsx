"use client";

import { AdminTrackList } from "@/components/admin-track-list";
import { UploadTrackModal } from "@/components/upload-track-modal";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/lib/use-user-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import type { UploadTrackData } from "@/components/upload-track-modal";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useUserAuth();
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const utils = api.useUtils();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleUploadTrack = async (trackData: UploadTrackData) => {
    try {
      console.log("Track uploaded successfully:", trackData);

      // Invalidate and refetch tracks to show the new track
      await utils.track.getAllByAdmin.invalidate();

      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Failed to handle track upload:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-dark min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-muted h-8 w-64 animate-pulse rounded" />
          <div className="bg-muted mt-4 h-4 w-96 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10">
      <div className="mb-8">
        <h1
          className="text-gradient-brand text-3xl font-bold"
          style={{ fontFamily: "alfarn-2" }}
        >
          Studio Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the studio! Browse and play tracks here.
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

      <AdminTrackList />

      {/* Upload Track Modal */}
      <UploadTrackModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUploadTrack}
      />
    </div>
  );
}
