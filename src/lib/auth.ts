import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../server/db";
import { oAuthProxy } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
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
});

export const getSession = async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  return session;
};

export type Session = typeof auth.$Infer.Session;
