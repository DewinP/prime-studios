"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        setError(error.message ?? "Signup failed");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-center text-3xl font-bold text-black">
            Admin Signup
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Create a new admin account for the studio.
          </p>
          {error && (
            <div className="mb-4 text-center text-red-500">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-1 block font-medium text-black">Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              Create Admin Account
            </button>
          </form>
          <div className="mt-4 text-center">
            <a
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-black"
            >
              Already have an account? Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
