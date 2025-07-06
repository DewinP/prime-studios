"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUserAuth } from "@/lib/use-user-auth";
import { useAuth } from "@/lib/auth-context";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserAuth();
  const { signOut } = useAuth();
  const isAdmin = user?.isAdmin;
  const cartItems = useCartStore((state) => state.items);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="supports-[backdrop-filter]:bg-background/60 border-border/50 bg-background/80 border-b backdrop-blur">
      <div className="mx-auto flex flex-col items-center px-4 pt-6 pb-4">
        <div className="flex w-full items-center justify-center">
          <Link href="/" className="mb-4 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Prime Studios"
              width={200}
              height={200}
              className="drop-shadow-glow-brand"
            />
          </Link>
        </div>
        <div className="relative mt-4 flex w-full items-center justify-between">
          {/* Left spacer to balance the layout */}
          <div className="pointer-events-none flex items-center space-x-4 opacity-0">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm font-medium">Cart</span>
            </div>
            {user && (
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">User</span>
              </div>
            )}
          </div>

          {/* Main Navigation - Dead Center */}
          <nav className="absolute left-1/2 flex -translate-x-1/2 transform items-center space-x-8 text-sm font-medium">
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
          </nav>

          {/* Cart and User - Right aligned */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              {cartItems.length > 0 ? (
                <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/20">
                  <div className="text-right">
                    <div className="text-foreground text-lg font-bold">
                      $
                      {(
                        cartItems.reduce((sum, item) => sum + item.price, 0) /
                        100
                      ).toFixed(2)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {cartItems.length}{" "}
                      {cartItems.length === 1 ? "item" : "items"}
                    </div>
                  </div>
                  <div className="relative">
                    <ShoppingCart className="text-foreground h-6 w-6 transition" />
                    <span className="bg-primary absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg">
                      {cartItems.length}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10">
                  <ShoppingCart className="text-foreground hover:text-primary h-6 w-6 transition" />
                  <span className="text-muted-foreground text-sm font-medium">
                    Cart
                  </span>
                </div>
              )}
            </Link>

            {/* User dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10">
                    <User className="text-foreground h-5 w-5" />
                    <span className="text-foreground max-w-[120px] truncate text-sm font-medium">
                      {user.email}
                    </span>
                    <ChevronDown className="text-muted-foreground h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {user.email}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {isAdmin ? "Administrator" : "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
