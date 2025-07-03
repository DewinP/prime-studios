import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../server/db";
import { oAuthProxy } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { env } from "@/env";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }

  // Check for Vercel URL
  if (process.env.VERCEL_URL) {
    // Ensure it's a valid URL
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl.includes("http")) {
      return vercelUrl;
    }
    return `https://${vercelUrl}`;
  }

  // Check for custom domain or production URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Fallback to localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6, // Allow shorter passwords for demo
    signUp: {
      // Temporarily enable signup for admin creation
      enabled: true,
    },
  },
  plugins: [nextCookies(), oAuthProxy()],
  baseUrl: `${getBaseUrl()}/api/auth`,
  trustedOrigins: [getBaseUrl()],
  secret: env.BETTER_AUTH_SECRET,
});

export const getSession = async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return {
    ...session,
    user,
  };
};

export type Session = typeof auth.$Infer.Session;
