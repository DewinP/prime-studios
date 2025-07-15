"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EmailVerificationModal } from "@/components/shared/email-verification-modal";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = searchParams.get("verifyEmail");
    if (email) {
      setVerifyEmail(email);
      setShowVerifyModal(true);
    }
  }, [searchParams]);

  function handleCloseModal() {
    setShowVerifyModal(false);
    // Remove the query param
    const params = new URLSearchParams(window.location.search);
    params.delete("verifyEmail");
    router.replace(`/auth/login${params.toString() ? `?${params}` : ""}`);
  }

  // Check for error parameter
  const errorParam = searchParams.get("error");
  if (errorParam === "unauthorized") {
    setError("Access denied. Please sign in to continue.");
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
        // Perform a hard refresh by redirecting to dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
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
              Login
            </CardTitle>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              Sign in to your account.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <EmailVerificationModal
              isOpen={showVerifyModal}
              onClose={handleCloseModal}
              email={verifyEmail ?? ""}
            />
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Login
              </Button>
            </form>
            <div className="mt-6 text-center">
              <a
                href="/auth/signup"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Don&apos;t have an account? Sign up
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
