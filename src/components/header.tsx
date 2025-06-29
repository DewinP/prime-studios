import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

export function Header() {
  return (
    <header className="supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="mx-auto flex flex-col items-center px-4 pb-2">
        <Link href="/" className="flex items-center justify-center">
          <Image src="/logo.png" alt="Prime Studios" width={200} height={200} />
        </Link>
        <nav className="mt-2 flex items-center justify-center gap-6 text-xs font-medium">
          <Link
            href="/"
            className="hover:text-primary/80 transition-colors"
            style={{ fontFamily: "alfarn-2" }}
          >
            TRACKS
          </Link>
          <Link
            href="/about"
            className="hover:text-primary/80 transition-colors"
            style={{ fontFamily: "alfarn-2" }}
          >
            ABOUT
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary/80 transition-colors"
            style={{ fontFamily: "alfarn-2" }}
          >
            CONTACT
          </Link>
          <Link
            href="/cart"
            className="hover:bg-muted flex items-center justify-center rounded border px-2 py-1 transition-colors"
            aria-label="Cart"
            style={{ fontFamily: "alfarn-2" }}
          >
            <ShoppingCart className="h-3 w-3" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
