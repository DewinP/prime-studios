import { api } from "@/trpc/react";

export function useUserAuth() {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = api.auth.getSessionWithUser.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });

  return {
    user: user?.user ?? null,
    isLoading,
    error,
    refetch,
    isAuthenticated: !!user?.user,
  };
}
