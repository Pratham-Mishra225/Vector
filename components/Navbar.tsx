"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const next = stored === "light" || stored === "dark"
      ? stored
      : prefersDark
        ? "dark"
        : "light";

    document.documentElement.classList.toggle("dark", next === "dark");
    setIsDark(next === "dark");

    if (stored !== "light" && stored !== "dark") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (event: MediaQueryListEvent) => {
        const systemNext = event.matches ? "dark" : "light";
        document.documentElement.classList.toggle(
          "dark",
          systemNext === "dark"
        );
        setIsDark(systemNext === "dark");
      };

      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }
  }, []);

  const handleThemeToggle = () => {
    const next = isDark ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setIsDark(next === "dark");
  };

  const isLoggedIn = Boolean(user && token);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(24,24,27,0.05)] transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted"
              type="button"
              onClick={handleThemeToggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <Link
              className="group flex items-center gap-3 text-2xl font-semibold tracking-tight leading-none text-foreground"
              href="/"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-lg font-semibold leading-none text-background shadow-sm">
                V
              </span>
              <span className="hidden sm:inline leading-none">Vector</span>
            </Link>
          </div>

          <div className="hidden items-center justify-center md:flex">
            <div className="flex items-center gap-1 rounded-lg border border-border/70 bg-background/70 p-1 shadow-sm backdrop-blur">
              <Link
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                href="/"
              >
                Explore
              </Link>
              <Link
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                href="/following"
              >
                Following
              </Link>
              <Link
                className="ml-1 rounded-md bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-foreground/90"
                href="/write"
              >
                Write
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              className="rounded-lg bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-foreground/90 md:hidden"
              href="/write"
            >
              Write
            </Link>

            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-3 rounded-lg border border-border/70 bg-background/80 px-3 py-1.5 shadow-sm transition hover:border-border hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30">
                  {user.avatar ? (
                    <img
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-border/60"
                      src={user.avatar}
                      alt={`${user.name} avatar`}
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background shadow-sm">
                      {user.name?.slice(0, 1) || "U"}
                    </div>
                  )}
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Account</p>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={10} className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-1.5">
                      <p className="text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Signed in</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/profile/${user._id}`)}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/write")}>
                      Write
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/following")}>
                      Following
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
                  href="/register"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}