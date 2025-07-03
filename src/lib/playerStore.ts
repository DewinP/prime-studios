import { create } from "zustand";

type Track = {
  id: string;
  name: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
};

type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  setTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  setTrack: (track) => {
    const currentState = get();

    // If it's the same track, toggle play/pause
    if (currentState.currentTrack?.id === track.id) {
      set({ isPlaying: !currentState.isPlaying });
    } else {
      // If it's a different track, set the new track and start playing
      set({ currentTrack: track, isPlaying: true });
    }
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
