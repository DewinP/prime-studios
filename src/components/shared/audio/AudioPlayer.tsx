"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
} from "lucide-react";
import { usePlayerStore } from "@/lib/playerStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function AudioPlayer() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [thumbPosition, setThumbPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const audioOperationRef = useRef<Promise<void> | null>(null);
  const isUserInteractingRef = useRef(false);
  const playPauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");

  const isAudioActuallyPlaying = () => {
    if (!audioRef.current) return false;
    return (
      audioRef.current.currentTime > 0 &&
      !audioRef.current.paused &&
      !audioRef.current.ended &&
      audioRef.current.readyState > audioRef.current.HAVE_CURRENT_DATA
    );
  };

  const executeAudioOperation = async (operation: () => Promise<void>) => {
    // Wait for any ongoing operation to complete
    if (audioOperationRef.current) {
      await audioOperationRef.current;
    }

    // Execute the new operation
    audioOperationRef.current = operation();
    try {
      await audioOperationRef.current;
    } catch (error) {
      // Ignore AbortError - this is expected when play is interrupted by pause
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Audio operation error:", error);
      }
    } finally {
      audioOperationRef.current = null;
    }
  };

  const resetTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      resetTrack();
      setIsLoading(true);
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          // Handle play error (e.g., autoplay policy)
          setIsPlaying(false);
          console.error("Audio play error:", e);
        });
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (!isUserInteractingRef.current) {
      debouncedPlayPause(isPlaying);
    }
  }, [isPlaying]);

  // Handle global pointer events for drag
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isDragging && sliderRef.current && duration > 0) {
        // Continue updating position even when pointer is outside slider
        const time = getTimeAtPosition(e.clientX, sliderRef.current);
        const newProgress = (time / duration) * 100;
        setProgress(newProgress);
        setCurrentTime(time);
        if (audioRef.current) {
          audioRef.current.currentTime = time;
        }
      }
    };

    if (isDragging) {
      document.addEventListener("pointerup", handleGlobalPointerUp);
      document.addEventListener("pointermove", handleGlobalPointerMove);
    }

    return () => {
      document.removeEventListener("pointerup", handleGlobalPointerUp);
      document.removeEventListener("pointermove", handleGlobalPointerMove);
    };
  }, [isDragging, duration]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    resetTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    }
  };

  const debouncedPlayPause = (shouldPlay: boolean) => {
    if (playPauseTimeoutRef.current) {
      clearTimeout(playPauseTimeoutRef.current);
    }

    playPauseTimeoutRef.current = setTimeout(() => {
      const executeOperation = async () => {
        if (!audioRef.current) return;

        if (shouldPlay) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.error("Failed to play audio:", error);
            setIsPlaying(false);
          }
        } else {
          audioRef.current.pause();
        }
      };

      void executeAudioOperation(executeOperation);
    }, 10); // Reduced from 50ms to 10ms for better responsiveness
  };

  const handleRepeatClick = () => {
    const modes: ("none" | "one" | "all")[] = ["none", "one", "all"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    if (nextMode) setRepeatMode(nextMode);
  };

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimeAtPosition = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    return percent * duration;
  };

  return (
    <div className="from-background via-background/95 to-background/90 border-border/50 fixed right-0 bottom-0 left-0 z-50 border-t bg-gradient-to-r shadow-2xl backdrop-blur-xl">
      {/* Progress Bar using shadcn Slider */}
      <div className="px-6 py-2">
        <div ref={sliderRef} className="relative w-full">
          <Slider
            value={[progress]}
            max={100}
            min={0}
            step={0.1}
            onValueChange={(value) => {
              if (audioRef.current && duration > 0 && value[0] !== undefined) {
                const newTime = (value[0] / 100) * duration;
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
                setProgress(value[0]);
                setThumbPosition(value[0]);
              }
            }}
            onValueCommit={(value) => {
              setIsDragging(false);
              // Resume playback if it was playing before seeking
              if (audioRef.current && wasPlayingBeforeDrag) {
                audioRef.current.play().catch((error) => {
                  console.error("Failed to resume playback:", error);
                });
              }
              setWasPlayingBeforeDrag(false);
            }}
            onPointerDown={() => {
              setIsDragging(true);
              setIsHovering(false);
              if (audioRef.current && isAudioActuallyPlaying()) {
                setWasPlayingBeforeDrag(true);
                audioRef.current.pause();
              }
            }}
            onPointerMove={(e) => {
              if (duration > 0) {
                if (!isDragging) {
                  // Only update hover state when not dragging
                  const time = getTimeAtPosition(e.clientX, e.currentTarget);
                  setHoverTime(time);
                  setIsHovering(true);
                  // Calculate thumb position based on mouse position
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percent = Math.max(0, Math.min(1, clickX / rect.width));
                  setThumbPosition(percent * 100);
                }
              }
            }}
            onPointerLeave={() => {
              if (!isDragging) {
                setIsHovering(false);
                setHoverTime(null);
              }
            }}
            onPointerUp={() => {
              setIsDragging(false);
            }}
            onPointerCancel={() => {
              setIsDragging(false);
            }}
            className="w-full"
          />

          {/* Custom tooltip that follows the thumb */}
          {isHovering && !isDragging && (
            <div
              className="pointer-events-none absolute z-10"
              style={{
                left: `${thumbPosition}%`,
                transform: "translateX(-50%)",
                bottom: "100%",
                marginBottom: "8px",
              }}
            >
              <div className="bg-popover border-border text-foreground rounded-lg border px-3 py-2 text-sm font-medium shadow-lg">
                {hoverTime !== null
                  ? formatTime(hoverTime)
                  : formatTime(currentTime)}
                <div className="absolute top-full left-1/2 -translate-x-1/2 transform">
                  <div className="border-t-popover border-4 border-transparent"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Player Content */}
      <div className="relative flex items-center justify-between px-6 py-4">
        {/* Left Section - Track Info */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="group relative">
            <Image
              src={currentTrack.coverUrl}
              alt={currentTrack.name}
              width={56}
              height={56}
              className="border-border/50 h-14 w-14 rounded-xl border shadow-lg transition-all duration-200 group-hover:scale-105"
            />
            {/* Play overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="text-foreground truncate text-lg font-bold"
              style={{ fontFamily: "alfarn-2, sans-serif" }}
            >
              {currentTrack.name}
            </div>
            <div className="text-muted-foreground truncate text-sm">
              {currentTrack.artist}
            </div>
          </div>
        </div>

        {/* Center Section - Main Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-10 w-10"
          >
            <Shuffle className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-10 w-10"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary h-12 w-12 rounded-full bg-gradient-to-r shadow-lg transition-all duration-200 hover:shadow-xl"
            onClick={() => setIsPlaying(!isPlaying)}
            size="icon"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <div className="flex h-6 w-6 items-center justify-center">
              {isPlaying ? (
                <Pause className="text-primary-foreground h-6 w-6" />
              ) : (
                <Play className="text-primary-foreground ml-0.5 h-6 w-6" />
              )}
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-10 w-10"
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-muted/50 h-10 w-10 ${
              repeatMode !== "none"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={handleRepeatClick}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="h-5 w-5" />
            ) : (
              <Repeat className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Right Section - Volume and Time */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
          {/* Time display */}
          <div className="text-muted-foreground hidden font-mono text-sm md:block">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Volume controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-8 w-8"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                min={0}
                step={0.01}
                onValueChange={(value) => {
                  if (value[0] !== undefined) {
                    const newVolume = value[0];
                    setVolume(newVolume);
                    if (audioRef.current) {
                      audioRef.current.volume = newVolume;
                    }
                    if (isMuted && newVolume > 0) {
                      setIsMuted(false);
                    }
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
      />
    </div>
  );
}
