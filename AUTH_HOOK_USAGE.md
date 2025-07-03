# useUserAuth Hook Usage

This document explains how to use the new `useUserAuth` hook for efficient session management in your Next.js application.

## Overview

The `useUserAuth` hook provides a cached session state that avoids repeated calls to the backend. It uses React Query under the hood to manage caching and provides a clean API for accessing user authentication state.

## Basic Usage

```tsx
import { useUserAuth } from "@/lib/use-user-auth";

function MyComponent() {
  const { user, session, isLoading, error, isAuthenticated } = useUserAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading session</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

## Hook Return Values

The `useUserAuth` hook returns an object with the following properties:

- `session`: The full session object (includes session metadata and user data)
- `user`: The user object from the session (null if not authenticated)
- `isLoading`: Boolean indicating if the session is being fetched
- `error`: Any error that occurred during the fetch
- `refetch`: Function to manually refetch the session
- `isAuthenticated`: Boolean indicating if the user is authenticated

## Advanced Usage with AuthContext

For components that need to perform auth-related actions (like sign out), use the `useAuth` hook:

```tsx
import { useAuth } from "@/lib/auth-context";

function UserMenu() {
  const { session, signOut, invalidateSession } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // Session cache will be automatically invalidated
  };

  return (
    <div>
      <span>Welcome, {session.user?.name}</span>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
```

## Caching Behavior

- **Stale Time**: 5 minutes - Data is considered fresh for 5 minutes
- **Garbage Collection Time**: 10 minutes - Data is kept in cache for 10 minutes
- **Retry**: 1 attempt on failure

## Manual Cache Invalidation

If you need to manually invalidate the session cache (e.g., after login):

```tsx
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const { invalidateSession } = useAuth();

  const handleLogin = async () => {
    // ... login logic
    invalidateSession(); // Force refetch of session
  };
}
```

## Setup Requirements

Make sure your app is wrapped with the necessary providers:

```tsx
// In your root layout
import { TRPCProvider } from "@/trpc/react";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({ children }) {
  return (
    <TRPCProvider>
      <AuthProvider>{children}</AuthProvider>
    </TRPCProvider>
  );
}
```

## Benefits

1. **Performance**: Session data is cached and shared across components
2. **Consistency**: All components see the same session state
3. **Automatic Updates**: Cache is invalidated on auth state changes
4. **Type Safety**: Full TypeScript support with proper types
5. **Error Handling**: Built-in error states and loading states

## Migration from Direct getSession Calls

Instead of calling `getSession()` in server components or making direct API calls, use the hook in client components:

```tsx
// Before (server component)
const session = await getSession();

// After (client component)
const { session } = useUserAuth();
```

This approach provides better performance and user experience by avoiding repeated network requests.
