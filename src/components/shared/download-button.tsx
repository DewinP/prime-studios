"use client";

import { useState, useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface DownloadButtonProps {
  trackId: string;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
  className?: string;
}

interface CachedDownloadData {
  downloadUrl: string;
  trackName: string;
  artist: string;
  timestamp: number;
}

export function DownloadButton({
  trackId,
  variant = "ghost",
  size = "sm",
  className = "",
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const cachedData = useRef<CachedDownloadData | null>(null);

  // Cache duration: 50 minutes (less than the 1-hour signed URL expiry)
  const CACHE_DURATION = 50 * 60 * 1000; // 50 minutes in milliseconds

  const downloadMutation = api.order.getDownloadUrl.useMutation({
    onSuccess: async (data) => {
      try {
        // Cache the download data
        cachedData.current = {
          ...data,
          timestamp: Date.now(),
        };

        // Fetch the file as a blob
        const response = await fetch(data.downloadUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        const blob = await response.blob();

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${data.trackName} - ${data.artist}.mp3`;
        link.style.display = "none";

        // Append to body, click, and cleanup
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);

        toast.success(`Downloading ${data.trackName}`);
        setIsDownloading(false);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download track");
        setIsDownloading(false);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to download track");
      setIsDownloading(false);
    },
  });

  const handleDownload = async () => {
    setIsDownloading(true);

    // Check if we have a valid cached URL
    if (
      cachedData.current &&
      Date.now() - cachedData.current.timestamp < CACHE_DURATION
    ) {
      // Use cached data
      try {
        const data = cachedData.current;

        // Fetch the file as a blob
        const response = await fetch(data.downloadUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        const blob = await response.blob();

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${data.trackName} - ${data.artist}.mp3`;
        link.style.display = "none";

        // Append to body, click, and cleanup
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);

        toast.success(`Downloading ${data.trackName}`);
        setIsDownloading(false);
      } catch (error) {
        console.error("Download error:", error);
        // If cached URL fails, clear cache and try again
        cachedData.current = null;
        downloadMutation.mutate({ trackId });
      }
    } else {
      // No valid cache, get new URL
      downloadMutation.mutate({ trackId });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      className={className}
    >
      <Download className="mr-1 h-4 w-4" />
      Download
    </Button>
  );
}
