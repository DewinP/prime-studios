"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="mx-auto flex flex-col items-center px-4 pb-2">
        <Link href="/" className="flex items-center justify-center">
          <Image src="/logo.png" alt="Prime Studios" width={200} height={200} />
        </Link>
        <nav className="mt-2 flex items-center justify-center gap-6 text-xs font-medium">
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
          <Link
            href="/cart"
            className={`flex items-center justify-center rounded border px-2 py-1 transition-colors ${
              pathname === "/cart"
                ? "bg-primary/20 text-primary"
                : "hover:bg-muted"
            }`}
            aria-label="Cart"
            style={{ fontFamily: "alfarn-2" }}
          >
            <div className="relative">
              <ShoppingCart className="h-3 w-3" />
              {mounted && getItemCount() > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs">
                  {getItemCount()}
                </span>
              )}
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
