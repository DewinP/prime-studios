import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export default async function DashboardPage() {
  // Check if user is authenticated using Better Auth
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }
  const user = session.user;

  // Get track stats and data using tRPC routes
  const tracks = await api.track.getAll();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Studio Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user.name ?? user.email}! Manage your tracks here.
          </p>
        </div>

        {/* Add Track Button */}
        <div className="mb-8">
          <button className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800">
            + Add New Track
          </button>
        </div>

        {/* Tracks List */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Tracks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {tracks.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No tracks found. Create your first track to get started!
              </div>
            ) : (
              tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                      {track.coverUrl ? (
                        <img
                          src={track.coverUrl}
                          alt={track.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">🎵</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {track.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {Math.floor(track.duration / 60)}:
                        {(track.duration % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        track.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {track.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {track.plays} plays
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
