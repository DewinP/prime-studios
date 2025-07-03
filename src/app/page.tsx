import { TrackList } from "@/components/track-list";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  // Fetch tracks server-side
  const tracks = await api.track.getAll();

  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col overflow-x-hidden px-4 pt-10">
        <div className="w-full">
          <h1
            className="text-gradient-brand mb-8 text-4xl font-bold"
            style={{ fontFamily: "alfarn-2" }}
          >
            TRACKS
          </h1>
          <TrackList tracks={tracks} />
        </div>
      </main>
    </HydrateClient>
  );
}
