"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Package } from "lucide-react";

interface AuthenticatedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthenticatedRoute({
  children,
  redirectTo = "/auth/login",
  fallback,
}: AuthenticatedRouteProps) {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session.isLoading && !session.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [session.isLoading, session.isAuthenticated, router, redirectTo]);

  // Show loading state while checking authentication
  if (session.isLoading) {
    return (
      fallback ?? (
        <div className="flex h-full min-h-screen justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-pulse transition-all duration-300" />
            <div className="text-muted-foreground">Authenticating...</div>
          </div>
        </div>
      )
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session.isAuthenticated) {
    return (
      fallback || (
        <div className="flex h-full items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Package className="text-muted-foreground h-8 w-8 animate-pulse" />
            <div className="text-muted-foreground">Redirecting...</div>
          </div>
        </div>
      )
    );
  }

  // Render children if authenticated
  return <>{children}</>;
}
