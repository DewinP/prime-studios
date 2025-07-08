"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Shield, BarChart2, Music, CreditCard, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const hasPermission = await authClient.admin.hasPermission({
          permissions: {
            user: ["list"],
          },
        });
        setIsAdmin(hasPermission.data?.success ?? false);
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    void checkAdminStatus();
  }, []);

  useEffect(() => {
    if (!loading && !isAdmin) {
      void router.push("/");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-8 w-8 animate-pulse" />
          <p>Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-8 w-8 animate-pulse" />
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-full">
      <aside className="bg-background/90 hidden w-64 flex-col space-y-8 border-r p-6 md:flex">
        <nav className="flex flex-col gap-2 text-base font-medium">
          <SidebarLink
            href="/dashboard"
            icon={<BarChart2 className="h-5 w-5" />}
            active={pathname === "/dashboard"}
          >
            Analytics
          </SidebarLink>
          <SidebarLink
            href="/dashboard/tracks"
            icon={<Music className="h-5 w-5" />}
            active={pathname === "/dashboard/tracks"}
          >
            Tracks
          </SidebarLink>
          <SidebarLink
            href="/dashboard/orders"
            icon={<CreditCard className="h-5 w-5" />}
            active={pathname === "/dashboard/orders"}
          >
            Order History
          </SidebarLink>
          <SidebarLink
            href="/dashboard/settings"
            icon={<Settings className="h-5 w-5" />}
            active={pathname === "/dashboard/settings"}
          >
            Settings
          </SidebarLink>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  active,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "hover:bg-muted hover:text-primary text-foreground/80"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
