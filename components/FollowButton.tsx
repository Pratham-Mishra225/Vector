"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";
import { showToast } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";

type FollowButtonProps = {
  targetUserId: string;
  initialFollowing?: boolean;
};

type FollowResponse = {
  success: boolean;
  data: {
    following: boolean;
  };
};

export default function FollowButton({
  targetUserId,
  initialFollowing = false,
}: FollowButtonProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [following, setFollowing] = useState(initialFollowing);
  const [isSaving, setIsSaving] = useState(false);

  if (user && user._id === targetUserId) {
    return null;
  }

  const handleToggle = async () => {
    if (!token) {
      showToast("Log in to follow users.", "error");
      router.push("/login");
      return;
    }

    if (isSaving) {
      return;
    }

    const previous = following;
    setFollowing(!following);
    setIsSaving(true);

    try {
      const result = await apiFetch<FollowResponse>(
        `/users/${targetUserId}/follow`,
        { method: "POST" }
      );

      setFollowing(result.data.following);
      showToast(
        result.data.following ? "Following user." : "Unfollowed user.",
        "success"
      );
    } catch {
      setFollowing(previous);
      showToast("Could not update follow.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      className={`rounded-full border px-4 py-1 text-xs uppercase tracking-[0.2em] transition ${
        following
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
      }`}
      type="button"
      onClick={handleToggle}
      disabled={isSaving}
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
