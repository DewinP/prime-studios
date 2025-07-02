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

export default function AudioPlayer() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const audioOperationRef = useRef<Promise<void> | null>(null);
  const isUserInteractingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const audioOperationLockRef = useRef(false);
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

  const updateProgress = useCallback(
    (clientX: number) => {
      if (!progressRef.current || !audioRef.current) return;
      if (duration === 0) {
        return;
      }
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const percent = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percent * 100);
    },
    [duration],
  );

  const handleSeek = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || hasDraggedRef.current) return;
    if (duration === 0) {
      console.log("handleSeek: duration is 0, skipping seek");
      return;
    }
    setIsSeeking(true);
    isUserInteractingRef.current = true;
    const wasPlaying = isAudioActuallyPlaying();
    if (wasPlaying) {
      audioRef.current.pause();
    }
    // Update position
    updateProgress(e.clientX);
    console.log(
      "HANDLE SEEK: set currentTime to",
      audioRef.current.currentTime,
      "duration:",
      duration,
    );
    if (wasPlaying) {
      setTimeout(() => {
        debouncedPlayPause(true);
      }, 100);
    }
    setTimeout(() => {
      setIsSeeking(false);
      isUserInteractingRef.current = false;
    }, 150);
  };

  const handleMouseDown = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    // Prevent default to avoid text selection
    e.preventDefault();

    isUserInteractingRef.current = true;
    hasDraggedRef.current = false;
    const wasPlaying = isAudioActuallyPlaying();

    // Pause if playing
    if (wasPlaying) {
      audioRef.current.pause();
    }

    // Remember if it was playing before drag
    setWasPlayingBeforeDrag(wasPlaying);
    setIsDragging(true);

    // Update initial position
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percent * duration;

      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percent * 100);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && progressRef.current && audioRef.current) {
        hasDraggedRef.current = true;
        const rect = progressRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percent * duration;

        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(percent * 100);
      }
    },
    [isDragging, duration],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    hasDraggedRef.current = false;

    // Resume playing only if it was playing before dragging started
    if (wasPlayingBeforeDrag) {
      setTimeout(() => {
        debouncedPlayPause(true);
        isUserInteractingRef.current = false;
      }, 50);
    } else {
      // Clear the flag immediately if not resuming
      isUserInteractingRef.current = false;
    }

    setWasPlayingBeforeDrag(false);
  }, [wasPlayingBeforeDrag]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!audioRef.current || isUserInteractingRef.current) return;

    // Use debounced play/pause to prevent rapid state changes
    debouncedPlayPause(isPlaying);
  }, [isPlaying, currentTrack]);

  // Reset progress when track changes
  useEffect(() => {
    console.log("RESET EFFECT RUNS, audioUrl:", currentTrack?.audioUrl);
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsDragging(false);
    setWasPlayingBeforeDrag(false);
    setIsSeeking(false);
    isUserInteractingRef.current = false;
    hasDraggedRef.current = false;
  }, [currentTrack?.audioUrl]);

  // Cleanup effect to stop audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      // Clear any pending play/pause timeout
      if (playPauseTimeoutRef.current) {
        clearTimeout(playPauseTimeoutRef.current);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100,
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
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
    setProgress(0);
    setCurrentTime(0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
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
    if (e.code === "Space") {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    }
  };

  const debouncedPlayPause = (shouldPlay: boolean) => {
    // Clear any existing timeout
    if (playPauseTimeoutRef.current) {
      clearTimeout(playPauseTimeoutRef.current);
    }

    // Set a new timeout to execute the play/pause operation
    playPauseTimeoutRef.current = setTimeout(() => {
      if (!audioRef.current) return;

      const executeOperation = async () => {
        try {
          if (shouldPlay) {
            if (!isAudioActuallyPlaying()) {
              await audioRef.current!.play();
            }
          } else {
            if (isAudioActuallyPlaying()) {
              audioRef.current!.pause();
            }
          }
        } catch (error) {
          // Ignore AbortError - this is expected when play is interrupted by pause
          if (error instanceof Error && error.name !== "AbortError") {
            console.error("Audio operation error:", error);
          }
        }
      };

      void executeOperation();
    }, 50); // 50ms debounce
  };

  const handleRepeatClick = () => {
    const modes: Array<"none" | "one" | "all"> = ["none", "one", "all"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    if (nextMode) setRepeatMode(nextMode);
  };

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-card border-border fixed right-0 bottom-0 left-0 z-50 shadow-2xl">
      {/* Progress Bar as Top Border */}
      <div
        ref={progressRef}
        className="relative w-full transition-all duration-200"
        style={{ height: "8px" }}
        onClick={handleSeek}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        role="progressbar"
        aria-label="Audio progress"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Transparent hit box background */}
        <div className="absolute inset-0 bg-transparent" />

        {/* Visible progress bar */}
        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-gray-700 transition-all duration-200">
          {/* Progress fill */}
          <div
            className="bg-primary absolute top-0 left-0 h-full transition-all duration-200"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Progress handle */}
        <div
          className={`bg-background border-primary absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border shadow-md transition-all duration-200 ${
            isDragging ? "scale-125 shadow-lg" : "hover:scale-110"
          }`}
          style={{ left: `${progress}%` }}
        >
          {/* Time popover */}
          {(isDragging || isHovering) && (
            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform">
              <div className="rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg">
                {formatTime(currentTime)}
              </div>
              {/* Arrow pointing down */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 transform">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-0.5 w-0.5 animate-pulse rounded-full bg-purple-400"></div>
          </div>
        )}
      </div>

      <div className="relative flex items-center px-6 py-2">
        {/* Left side - Art, Name, Artist */}
        <div className="flex items-center gap-3">
          <Image
            src={currentTrack.cover}
            alt={currentTrack.title}
            width={40}
            height={40}
            className="border-border bg-background h-10 w-10 rounded-md border"
          />
          <div className="min-w-0 flex-1">
            <div
              className="text-foreground text-base font-semibold"
              style={{ fontFamily: "alfarn-2, sans-serif" }}
            >
              {currentTrack.title}
            </div>
            <div className="text-xs text-gray-400">{currentTrack.artist}</div>
          </div>
        </div>

        {/* Center - Main Audio Controls */}
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
          <button className="group border-border bg-background relative cursor-pointer rounded-lg border p-2.5 transition-all hover:bg-gray-800">
            <Shuffle className="h-4 w-4 text-gray-300" />
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
              Shuffle
            </div>
          </button>
          <button className="group border-border bg-background relative cursor-pointer rounded-lg border p-2.5 transition-all hover:bg-gray-800">
            <SkipBack className="h-4 w-4 text-gray-300" />
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
              Previous
            </div>
          </button>
          <Button
            className="group relative rounded-lg p-3 transition-all"
            onClick={() => setIsPlaying(!isPlaying)}
            variant="default"
            size="icon"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 text-white" />
              )}
            </div>
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
              {isPlaying ? "Pause" : "Play"}
            </div>
          </Button>
          <button className="group border-border bg-background relative cursor-pointer rounded-lg border p-2.5 transition-all hover:bg-gray-800">
            <SkipForward className="h-4 w-4 text-gray-300" />
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
              Next
            </div>
          </button>
          <button
            onClick={handleRepeatClick}
            className="group border-border bg-background relative rounded-lg border p-2.5 transition-all hover:bg-gray-800"
          >
            {repeatMode === "none" ? (
              <Repeat className="h-4 w-4 text-gray-500" />
            ) : repeatMode === "one" ? (
              <Repeat1 className="h-4 w-4 text-purple-400" />
            ) : (
              <Repeat className="h-4 w-4 text-purple-400" />
            )}
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
              {repeatMode === "none"
                ? "Repeat Off"
                : repeatMode === "one"
                  ? "Repeat One"
                  : "Repeat All"}
            </div>
          </button>
        </div>

        {/* Right side - Volume Controls */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-3 px-2 py-1">
            <button
              onClick={toggleMute}
              className="group relative rounded p-1 hover:bg-gray-800"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-gray-300" />
              ) : (
                <Volume2 className="h-4 w-4 text-gray-300" />
              )}
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                {isMuted ? "Unmute" : "Mute"}
              </div>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="focus:ring-primary/40 [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary h-1 w-16 cursor-pointer appearance-none rounded-lg bg-gray-700 focus:ring-2 focus:outline-none [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
              style={{
                background: `linear-gradient(to right, #e5a629 0%, #e5a629 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`,
              }}
              aria-label="Volume"
            />
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
