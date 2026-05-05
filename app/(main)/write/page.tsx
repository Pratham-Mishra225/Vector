"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { apiFetch } from "@/lib/apiFetch";
import { showToast } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
      Loading editor...
    </div>
  ),
});

type CreatePostResponse = {
  success: boolean;
  data: {
    post: {
      id: string;
    };
  };
};

export default function WritePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hydrate = useAuthStore((state) => state.hydrate);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    hydrate();
    setIsHydrated(true);
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!token) {
      router.replace("/login");
    }
  }, [isHydrated, token, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await apiFetch<CreatePostResponse>("/posts", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      showToast("Post published!", "success");
      router.push(`/post/${result.data.post.id}`);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Failed to publish";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-12 text-sm text-zinc-600">
        Checking your session...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-12 text-sm text-zinc-600">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <input
            className="w-full text-2xl font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            type="text"
            name="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
          />
          <button
            className="ml-4 shrink-0 rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>

        <div data-color-mode="light" className="rounded-xl border border-gray-200 bg-white">
          <MDEditor
            value={content}
            onChange={(value) => setContent(value ?? "")}
            height={520}
            preview="edit"
          />
        </div>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
