import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestTracks(userId) {
  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("User not found with ID:", userId);
      return;
    }

    console.log("Creating test tracks for user:", user.name);

    // Create multiple test tracks
    const testTracks = [
      {
        name: "Summer Vibes",
        artist: user.name,
        description: "A chill summer beat with tropical vibes",
        duration: 240, // 4 minutes
        audioUrl: "/bodies.mp3",
        coverUrl: "https://picsum.photos/seed/summer/80/80",
        status: "published",
        plays: 42,
      },
      {
        name: "Night Drive",
        artist: user.name,
        description: "Synthwave track perfect for late night drives",
        duration: 320, // 5 minutes 20 seconds
        audioUrl: "/bodies.mp3",
        coverUrl: "https://picsum.photos/seed/night/80/80",
        status: "published",
        plays: 128,
      },
      {
        name: "Urban Flow",
        artist: user.name,
        description: "Hip-hop inspired beat with urban energy",
        duration: 180, // 3 minutes
        audioUrl: "/bodies.mp3",
        coverUrl: "https://picsum.photos/seed/urban/80/80",
        status: "draft",
        plays: 0,
      },
      {
        name: "Electronic Dreams",
        artist: user.name,
        description: "Ambient electronic track with dreamy textures",
        duration: 420, // 7 minutes
        audioUrl: "/bodies.mp3",
        coverUrl: "https://picsum.photos/seed/electronic/80/80",
        status: "published",
        plays: 89,
      },
      {
        name: "Rock Anthem",
        artist: user.name,
        description: "High-energy rock track with powerful riffs",
        duration: 280, // 4 minutes 40 seconds
        audioUrl: "/bodies.mp3",
        coverUrl: "https://picsum.photos/seed/rock/80/80",
        status: "draft",
        plays: 0,
      },
    ];

    // Create all test tracks
    const createdTracks = [];
    for (const trackData of testTracks) {
      const track = await prisma.track.create({
        data: {
          ...trackData,
          userId: userId,
        },
      });
      createdTracks.push(track);
      console.log("Created track:", track.name);
    }

    console.log(
      `\n✅ Successfully created ${createdTracks.length} test tracks for user: ${user.name}`,
    );
    console.log("Tracks created:");
    createdTracks.forEach((track, index) => {
      console.log(
        `${index + 1}. ${track.name} (${track.status}) - ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}`,
      );
    });
  } catch (error) {
    console.error("Error creating test tracks:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get user ID from command line argument
const userId = process.argv[2];

if (!userId) {
  console.error("Please provide a user ID as an argument");
  console.log("Usage: node create-test-tracks.js <user-id>");
  process.exit(1);
}

createTestTracks(userId);
