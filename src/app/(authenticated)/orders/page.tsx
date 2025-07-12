"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadButton } from "@/components/shared/download-button";
import { api } from "@/trpc/react";
import { Music, Calendar, FileText, Play, Pause } from "lucide-react";
import { format } from "date-fns";
import { usePlayerStore } from "@/lib/playerStore";
import { Button } from "@/components/ui/button";

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
  stripeProductId: string | null;
}

export default function OrdersPage() {
  const {
    data: purchasedTracks,
    isLoading,
    error,
  } = api.order.getUserPurchasedTracks.useQuery();

  const { currentTrack, isPlaying, setTrack, setIsPlaying } = usePlayerStore();

  const handleTrackPlay = (track: Track) => {
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

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Licensed Tracks</h1>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="bg-muted mb-2 h-4 w-1/3 rounded"></div>
                <div className="bg-muted h-3 w-1/4 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Licensed Tracks</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Error loading tracks: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!purchasedTracks || purchasedTracks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Licensed Tracks</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <Music className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">
              No tracks purchased yet
            </h3>
            <p className="text-muted-foreground">
              Purchase some tracks to see them here and download them anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Licensed Tracks</h1>

      <div className="grid gap-6">
        {purchasedTracks.map(({ track, licenses }) => (
          <Card key={track.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2 text-xl">{track.name}</CardTitle>
                  <p className="text-muted-foreground mb-3">
                    by {track.artist}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {licenses.map((license, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {license.licenseType.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Purchased{" "}
                        {licenses[0] &&
                          format(
                            new Date(licenses[0].purchasedAt),
                            "MMM dd, yyyy",
                          )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Order #{licenses[0]?.orderNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTrackPlay(track)}
                    className="text-primary hover:text-primary/80"
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  <DownloadButton
                    trackId={track.id}
                    variant="default"
                    size="default"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
