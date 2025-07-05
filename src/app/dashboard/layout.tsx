"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Music, CreditCard, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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
            href="/dashboard/payments"
            icon={<CreditCard className="h-5 w-5" />}
            active={pathname === "/dashboard/payments"}
          >
            Payment History
          </SidebarLink>
          <SidebarLink
            href="/settings"
            icon={<Settings className="h-5 w-5" />}
            active={pathname === "/settings"}
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
