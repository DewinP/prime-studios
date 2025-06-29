import { HydrateClient } from "@/trpc/server";
import { BeatsList } from "@/components/beats-list";
import type { Beat } from "@/components/beats-list";

const beats: Beat[] = [
  {
    id: "1",
    title: "Archive Test",
    time: "0:30",
    tags: ["archive", "test"],
    artUrl: "https://picsum.photos/seed/beat1/80/80",
    audioUrl: "/bodies.mp3",
    artist: "archive.org",
    price: 100,
  },
  {
    id: "2",
    title: "Trap Beat",
    time: "3:12",
    tags: ["trap", "808"],
    artUrl: "https://picsum.photos/seed/beat2/80/80",
    audioUrl: "/bodies.mp3",
    artist: "prime",
    price: 100,
  },
  {
    id: "3",
    title: "Jazz Hop",
    time: "2:58",
    tags: ["jazz", "hiphop"],
    artUrl: "https://picsum.photos/seed/beat3/80/80",
    audioUrl: "/bodies.mp3",
    artist: "prime",
    price: 100,
  },
  {
    id: "4",
    title: "Synthwave",
    time: "4:01",
    tags: ["synth", "retro"],
    artUrl: "https://picsum.photos/seed/beat4/80/80",
    audioUrl: "/bodies.mp3",
    artist: "prime",
    price: 100,
  },
];

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <div className="w-full">
          <h1 className="mb-6 py-5 text-3xl font-bold">Tracks</h1>
          <BeatsList beats={beats} />
        </div>
      </main>
    </HydrateClient>
  );
}
