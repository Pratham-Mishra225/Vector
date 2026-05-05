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
    <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
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
      <div className="mx-auto w-full max-w-5xl px-6 py-12 text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-12 text-sm text-muted-foreground">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <form className="space-y-10" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between border-b border-border/70 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Draft
          </p>
          <button
            className="rounded-lg bg-foreground px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>

        <input
          className="w-full text-4xl font-semibold leading-tight tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none"
          type="text"
          name="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
        />

        <div data-color-mode="light" className="border-0 bg-transparent">
          <MDEditor
            value={content}
            onChange={(value) => setContent(value ?? "")}
            height={600}
            preview="edit"
            visibleDragbar={false}
            hideToolbar
            className="border-0 !shadow-none bg-transparent"
            textareaProps={{
              className:
                "text-lg leading-relaxed text-foreground focus:outline-none",
              placeholder: "Start writing your story...",
            }}
          />
        </div>

        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
