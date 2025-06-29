import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Dashboard</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="hover:text-foreground/80 transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/settings"
              className="hover:text-foreground/80 transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
