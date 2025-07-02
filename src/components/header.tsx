"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="mx-auto flex flex-col items-center px-4 pb-2">
        <Link href="/" className="flex items-center justify-center">
          <Image src="/logo.png" alt="Prime Studios" width={200} height={200} />
        </Link>
        <nav className="flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/" ? "text-primary" : "hover:text-primary/80"
            }`}
            style={{ fontFamily: "alfarn-2" }}
          >
            TRACKS
          </Link>
          <Link
            href="/about"
            className={`transition-colors ${
              pathname === "/about" ? "text-primary" : "hover:text-primary/80"
            }`}
            style={{ fontFamily: "alfarn-2" }}
          >
            ABOUT
          </Link>
          <Link
            href="/contact"
            className={`transition-colors ${
              pathname === "/contact" ? "text-primary" : "hover:text-primary/80"
            }`}
            style={{ fontFamily: "alfarn-2" }}
          >
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
}
