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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link className="text-lg font-semibold text-zinc-900" href="/">
            Blogspace
          </Link>
          <div className="hidden items-center gap-4 text-sm font-medium text-zinc-500 sm:flex">
            <Link className="transition hover:text-zinc-800" href="/">
              Explore
            </Link>
            <Link className="transition hover:text-zinc-800" href="/following">
              Following
            </Link>
          </div>
        </div>

        <div className="hidden w-full max-w-sm px-6 md:block">
          <input
            className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
            type="search"
            placeholder="Search posts"
            aria-label="Search posts"
          />
        </div>

        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-900"
            href="/write"
          >
            Write
          </Link>
          {isLoggedIn && user ? (
            <>
              <Link
                className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 transition hover:border-gray-300"
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
