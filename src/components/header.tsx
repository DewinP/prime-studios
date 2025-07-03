"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUserAuth } from "@/lib/use-user-auth";

export function Header() {
  const pathname = usePathname();
  const { user } = useUserAuth();
  const isAdmin = user?.isAdmin;

  return (
    <header className="supports-[backdrop-filter]:bg-background/60 border-border/50 bg-background/80 border-b backdrop-blur">
      <div className="mx-auto flex flex-col items-center px-4 pt-6 pb-4">
        <Link href="/" className="mb-4 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Prime Studios"
            width={200}
            height={200}
            className="drop-shadow-glow-brand"
          />
        </Link>
        <nav className="flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-all duration-200 ease-in-out ${
              pathname === "/"
                ? "text-primary font-semibold"
                : "text-foreground/80 hover:text-primary hover:scale-105"
            }`}
            style={{ fontFamily: "alfarn-2" }}
          >
            TRACKS
          </Link>
          <Link
            href="/about"
            className={`transition-all duration-200 ease-in-out ${
              pathname === "/about"
                ? "text-primary font-semibold"
                : "text-foreground/80 hover:text-primary hover:scale-105"
            }`}
            style={{ fontFamily: "alfarn-2" }}
          >
            ABOUT
          </Link>
          <Link
            href="/contact"
            className={`transition-all duration-200 ease-in-out ${
              pathname === "/contact"
                ? "text-primary font-semibold"
                : "text-foreground/80 hover:text-primary hover:scale-105"
            }`}
            style={{ fontFamily: "alfarn-2" }}
          >
            CONTACT
          </Link>
          {isAdmin && (
            <Link
              href="/dashboard"
              className={`transition-all duration-200 ease-in-out ${
                pathname === "/dashboard"
                  ? "text-primary font-semibold"
                  : "text-foreground/80 hover:text-primary hover:scale-105"
              }`}
              style={{ fontFamily: "alfarn-2" }}
            >
              DASHBOARD
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/settings"
              className={`transition-all duration-200 ease-in-out ${
                pathname === "/settings"
                  ? "text-primary font-semibold"
                  : "text-foreground/80 hover:text-primary hover:scale-105"
              }`}
              style={{ fontFamily: "alfarn-2" }}
            >
              SETTINGS
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
