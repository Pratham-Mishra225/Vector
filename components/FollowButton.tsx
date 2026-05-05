"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

  const [following, setFollowing] = useState(initialFollowing);
  const [isSaving, setIsSaving] = useState(false);

  if (user && user._id === targetUserId) {
    return null;
  }

  const handleToggle = async () => {
    if (!user) {
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
      className={`rounded-lg border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
        following
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
      }`}
      type="button"
      onClick={handleToggle}
      disabled={isSaving}
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
