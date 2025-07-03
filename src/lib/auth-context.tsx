"use client";

import { createContext, useContext, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserAuth } from "./use-user-auth";
import { authClient } from "./auth-client";

interface AuthContextType {
  session: ReturnType<typeof useUserAuth>;
  signOut: () => Promise<void>;
  invalidateSession: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useUserAuth();
  const queryClient = useQueryClient();

  const invalidateSession = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
  }, [queryClient]);

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
      invalidateSession();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [invalidateSession]);

  return (
    <AuthContext.Provider
      value={{
        session,
        signOut,
        invalidateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
