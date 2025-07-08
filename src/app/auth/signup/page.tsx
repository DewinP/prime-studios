"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-background flex min-h-screen justify-center">
      <div className="w-full max-w-md">
        <Card className="shadow-glow bg-card border-border border">
          <CardHeader>
            <CardTitle
              className="text-gradient-brand text-center text-3xl"
              style={{ fontFamily: "alfarn-2" }}
            >
              Sign Up
            </CardTitle>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              Create a new account.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  className="border-border border"
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="border-border border"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  className="border-border border"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Create Account
              </Button>
            </form>
            <div className="mt-6 text-center">
              <a
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Already have an account? Login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
