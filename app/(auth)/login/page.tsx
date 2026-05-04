"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";
import { showToast } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";

type LoginResponse = {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string;
    };
  };
};

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(
        {
          _id: result.data.user.id,
          name: result.data.user.name,
          email: result.data.user.email,
          avatar: result.data.user.avatar,
        },
        result.data.token
      );

      showToast("Welcome back!", "success");
      router.push("/");
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Login failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">Welcome back</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Sign in to continue exploring and writing.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-zinc-800">
          Email
          <input
            className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="block text-sm font-medium text-zinc-800">
          Password
          <input
            className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
