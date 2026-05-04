"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";
import { showToast } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";

type LikeButtonProps = {
  postId: string;
  initialLiked?: boolean;
  initialCount?: number;
};

type LikeResponse = {
  success: boolean;
  data: {
    liked: boolean;
    likeCount: number;
  };
};

export default function LikeButton({
  postId,
  initialLiked = false,
  initialCount = 0,
}: LikeButtonProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async () => {
    if (!token) {
      showToast("Log in to like posts.", "error");
      router.push("/login");
      return;
    }

    if (isSaving) {
      return;
    }

    const previousLiked = liked;
    const previousCount = count;
    const nextLiked = !liked;
    const nextCount = Math.max(0, count + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setCount(nextCount);
    setIsSaving(true);

    try {
      const result = await apiFetch<LikeResponse>(`/posts/${postId}/like`, {
        method: "POST",
      });

      setLiked(result.data.liked);
      setCount(result.data.likeCount);
      showToast(result.data.liked ? "Liked post." : "Unliked post.", "success");
    } catch {
      setLiked(previousLiked);
      setCount(previousCount);
      showToast("Could not update like.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition ${
        liked
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-black/10 text-zinc-600 hover:border-black/20"
      }`}
      type="button"
      aria-pressed={liked}
      onClick={handleToggle}
      disabled={isSaving}
    >
      <svg
        className={`h-4 w-4 ${liked ? "fill-current" : "fill-transparent"}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-7.5-4.5-9-8.5C1.7 9 3 6 6 5.5 8.2 5.2 10 6.5 12 8.6 14 6.5 15.8 5.2 18 5.5 21 6 22.3 9 21 12.5 19.5 16.5 12 21 12 21z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
