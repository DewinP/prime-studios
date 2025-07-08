"use client";

import { useUserAuth } from "@/lib/use-user-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield } from "lucide-react";
import { api } from "@/trpc/react";

export default function SettingsPage() {
  const { data: adminUsers, isLoading: isLoadingAdmins } =
    api.auth.getAllAdmins.useQuery();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-2 text-3xl font-bold"
            style={{ fontFamily: "alfarn-2, sans-serif" }}
          >
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage admin users and their contact information
          </p>
        </div>

        {/* Admin Users Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="text-primary h-5 w-5" />
              <div>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>
                  View all admin users and their contact information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingAdmins ? (
              <div className="text-muted-foreground py-8 text-center">
                <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                <p>Loading admin users...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminUsers?.map((admin) => (
                  <div
                    key={admin.id}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <User className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-semibold">{admin.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {admin.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-right text-sm">
                      <div>
                        Added {new Date(admin.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {adminUsers && adminUsers.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No admin users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
