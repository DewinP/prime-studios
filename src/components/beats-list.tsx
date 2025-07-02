"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { usePlayerStore } from "@/lib/playerStore";

export type Beat = {
  id: string;
  title: string;
  time: string;
  tags: string[];
  artUrl: string;
  artist: string;
  audioUrl: string;
};

export function BeatsList({ beats }: { beats: Beat[] }) {
  const setTrack = usePlayerStore((state) => state.setTrack);

  return (
    <div className="bg-background w-full overflow-x-auto rounded border">
      <div className="bg-muted/40 text-muted-foreground hidden grid-cols-[56px_1.5fr_64px_1fr_120px] gap-2 border-b px-4 py-2 text-xs font-semibold tracking-wider uppercase md:grid">
        <div></div>
        <div>Title</div>
        <div>Time</div>
        <div>Tags</div>
        <div className="text-right">Options</div>
      </div>
      <div className="divide-border divide-y">
        {beats.map((beat) => (
          <div
            key={beat.id}
            className="group hover:bg-muted/50 flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors"
            onClick={() =>
              setTrack({
                id: Number(beat.id),
                title: beat.title,
                artist: beat.artist,
                collaborator: "",
                duration: beat.time,
                cover: beat.artUrl,
                audioUrl: beat.audioUrl,
              })
            }
          >
            {/* Cover Art */}
            <div className="bg-muted flex h-14 w-14 shrink-0 items-center justify-center rounded-md">
              <img
                src={beat.artUrl}
                alt={beat.title}
                className="h-full w-full rounded-md object-cover"
              />
            </div>

            {/* Title */}
            <div className="min-w-0 flex-1">
              <h3
                className="truncate font-medium"
                style={{ fontFamily: "alfarn-2" }}
              >
                {beat.title}
              </h3>
              <p className="text-muted-foreground truncate text-sm">
                {beat.artist}
              </p>
            </div>

            {/* Duration */}
            <div className="text-muted-foreground hidden text-sm md:block">
              {beat.time}
            </div>

            {/* Tags */}
            <div className="flex w-full flex-wrap justify-center gap-1 md:w-auto md:justify-start">
              {beat.tags.map((tag) => (
                <Badge
                  variant="outline"
                  key={tag}
                  className="max-w-[80px] truncate px-2 py-0.5 text-xs font-normal transition-all group-hover:underline hover:cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {/* Options */}
            <div className="mt-2 flex w-full justify-center gap-1 md:mt-0 md:w-auto md:justify-end">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 cursor-pointer p-0"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
