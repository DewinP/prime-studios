import { createAuthClient } from "better-auth/react";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const authClient = createAuthClient({
  baseURL: `${getBaseUrl()}/api/auth`,
});
