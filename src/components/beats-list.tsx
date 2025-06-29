"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, ShoppingCart } from "lucide-react";
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
      <div className="divide-y">
        {beats.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No beats found.
          </div>
        ) : (
          beats.map((beat) => (
            <div
              key={beat.id}
              className="group hover:bg-muted/50 flex flex-col items-center gap-2 px-2 py-2 transition-colors md:grid md:grid-cols-[56px_1.5fr_64px_1fr_120px] md:px-4"
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
              {/* Art */}
              <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md">
                <img
                  src={beat.artUrl}
                  alt={beat.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Title */}
              <div className="w-full truncate text-center text-sm font-medium md:w-auto md:text-left">
                <span className="font-alfarn2 cursor-pointer transition-all group-hover:underline">
                  {beat.title}
                </span>
              </div>
              {/* Time */}
              <div className="text-muted-foreground w-full text-center text-sm md:w-auto md:text-left">
                {beat.time}
              </div>
              {/* Tags */}
              <div className="flex w-full flex-wrap justify-center gap-1 md:w-auto md:justify-start">
                {beat.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="max-w-[80px] truncate px-2 py-0.5 text-xs font-normal transition-all group-hover:underline"
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
                <Button
                  size="sm"
                  className="hover:bg-primary h-7 cursor-pointer px-3 text-xs font-semibold transition-colors hover:shadow-lg"
                >
                  <ShoppingCart className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
