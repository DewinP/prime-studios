import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../server/db";
import { oAuthProxy, admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { env } from "@/env";
import { Resend } from "resend";
import { createEmailVerificationTemplate } from "./email-templates";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
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

const resend = new Resend(env.RESEND_API_KEY);

// Use test email in development, actual domain in production
const getFromEmail = () => {
  if (env.NODE_ENV === "development") {
    return "onboarding@resend.dev";
  }
  return "Prime Studios NYC <no-reply@primestudiosnyc.com>";
};

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 6,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: getFromEmail(),
        to: user.email,
        subject: "Email Verification",
        html: createEmailVerificationTemplate({ url }),
      });
    },
  },
  plugins: [
    nextCookies(),
    oAuthProxy(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      impersonationSessionDuration: 60 * 60, // 1 hour
    }),
  ],
  baseURL: `${getBaseUrl()}/api/auth`,
  trustedOrigins: [getBaseUrl(), env.BETTER_AUTH_URL],
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
