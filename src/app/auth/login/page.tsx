"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for error parameter
  const errorParam = searchParams.get("error");
  if (errorParam === "unauthorized") {
    setError("Access denied. Admin privileges required.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message ?? "Login failed");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-center text-3xl font-bold text-black">
            Studio Admin Login
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Admin access only.
          </p>
          {error && (
            <div className="mb-4 text-center text-red-500">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-1 block font-medium text-black">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="mb-1 block font-medium text-black">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-black py-3 font-medium text-white transition hover:bg-gray-800"
              disabled={isLoading}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
