"use client";

import { useUserAuth } from "@/lib/use-user-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function UserProfile() {
  const { user, isLoading, error, isAuthenticated } = useUserAuth();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
          <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load user profile</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Not Authenticated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log in to view your profile
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Name</h3>
          <p className="text-muted-foreground">
            {user?.name ?? "Not provided"}
          </p>
        </div>
        <div>
          <h3 className="font-medium">Email</h3>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <div>
          <h3 className="font-medium">Status</h3>
          <Badge variant="default" className="mt-1">
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
