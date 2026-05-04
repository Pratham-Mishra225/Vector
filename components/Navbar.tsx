"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const isLoggedIn = Boolean(user && token);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6 text-sm font-semibold tracking-wide text-zinc-900">
          <Link
            className="transition hover:text-zinc-600"
            href="/"
          >
            Explore
          </Link>
          <Link
            className="transition hover:text-zinc-600"
            href="/following"
          >
            Following
          </Link>
          <Link
            className="rounded-full border border-zinc-900 px-4 py-1 text-xs uppercase tracking-[0.2em] transition hover:bg-zinc-900 hover:text-white"
            href="/write"
          >
            Write
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold">
          {isLoggedIn && user ? (
            <>
              <Link
                className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1 transition hover:border-black/30"
                href={`/profile/${user._id}`}
              >
                {user.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold uppercase text-white">
                    {user.name.slice(0, 1)}
                  </div>
                )}
                <span className="hidden text-zinc-700 sm:inline">
                  {user.name}
                </span>
              </Link>
              <button
                className="rounded-full border border-zinc-900 px-4 py-1 text-xs uppercase tracking-[0.2em] transition hover:bg-zinc-900 hover:text-white"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="rounded-full border border-zinc-900 px-4 py-1 text-xs uppercase tracking-[0.2em] transition hover:bg-zinc-900 hover:text-white"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-full border border-zinc-900 px-4 py-1 text-xs uppercase tracking-[0.2em] transition hover:bg-zinc-900 hover:text-white"
                href="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
