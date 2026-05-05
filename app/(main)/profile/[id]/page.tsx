"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";
import { useAuthStore } from "@/store/authStore";
import FollowButton from "@/components/FollowButton";
import PostCard from "@/components/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ApiUser = {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  createdAt: string;
};

type ApiPost = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  };
};

type ProfileResponse = {
  success: boolean;
  data: {
    user: ApiUser;
    posts: ApiPost[];
  };
};

type FollowingResponse = {
  success: boolean;
  data: {
    followingIds: string[];
  };
};

type UpdateProfileResponse = {
  success: boolean;
  data: ApiUser;
};

export default function ProfilePage() {
  const params = useParams();
  const profileId = typeof params.id === "string" ? params.id : params.id?.[0];

  const authUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [user, setUser] = useState<ApiUser | null>(null);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [initialFollowing, setInitialFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) {
      return;
    }

    let isActive = true;

    const loadProfile = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const result = await apiFetch<ProfileResponse>(`/users/${profileId}`);
        if (!isActive) {
          return;
        }

        setUser(result.data.user);
        setPosts(result.data.posts);
        setBio(result.data.user.bio ?? "");
        setAvatar(result.data.user.avatar ?? "");
      } catch (caught) {
        if (!isActive) {
          return;
        }

        const message =
          caught instanceof Error ? caught.message.toLowerCase() : "";
        setNotFound(message.includes("not found"));
        setUser(null);
        setPosts([]);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [profileId]);

  useEffect(() => {
    if (!profileId || !token) {
      return;
    }

    let isActive = true;

    const loadFollowing = async () => {
      try {
        const result = await apiFetch<FollowingResponse>(
          `/users/${profileId}/follow`
        );

        if (!isActive) {
          return;
        }

        setInitialFollowing(result.data.followingIds.includes(profileId));
      } catch {
        if (isActive) {
          setInitialFollowing(false);
        }
      }
    };

    loadFollowing();

    return () => {
      isActive = false;
    };
  }, [profileId, token]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <Card className="rounded-lg border border-border bg-card shadow-sm">
          <CardContent className="pt-4 text-sm text-muted-foreground">
            Loading profile...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <Card className="rounded-lg border border-border bg-card shadow-sm">
          <CardContent className="pt-4 text-sm text-muted-foreground">
            User not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isOwnProfile = Boolean(authUser && authUser._id === user._id);

  const handleEdit = () => {
    setFormError(null);
    setBio(user.bio ?? "");
    setAvatar(user.avatar ?? "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormError(null);
    setBio(user.bio ?? "");
    setAvatar(user.avatar ?? "");
    setIsEditing(false);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profileId || isSaving) {
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const result = await apiFetch<UpdateProfileResponse>(
        `/users/${profileId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ bio, avatar }),
        }
      );

      setUser(result.data);
      setIsEditing(false);
    } catch (caught) {
      setFormError(
        caught instanceof Error ? caught.message : "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <Card className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={user.avatar}
                  alt={`${user.name} avatar`}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-lg font-semibold uppercase text-background">
                  {user.name.slice(0, 1)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {user.name}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {user.bio?.length ? user.bio : "No bio yet"}
                </p>
                <p className="text-sm text-muted-foreground">Joined {formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isOwnProfile ? (
                <button
                  className="rounded-lg border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  type="button"
                  onClick={handleEdit}
                >
                  Edit Profile
                </button>
              ) : (
                <FollowButton
                  targetUserId={user._id}
                  initialFollowing={initialFollowing}
                />
              )}
            </div>
          </div>

          {isOwnProfile && isEditing ? (
            <form className="space-y-4 border-t border-border/70 pt-6" onSubmit={handleSave}>
              <label className="block text-sm font-medium text-foreground">
                Bio
                <Textarea
                  className="mt-2 min-h-24 text-sm text-foreground"
                  rows={4}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Tell us about yourself"
                />
              </label>

              <label className="block text-sm font-medium text-foreground">
                Avatar URL
                <Input
                  className="mt-2 h-10 text-sm text-foreground"
                  type="url"
                  value={avatar}
                  onChange={(event) => setAvatar(event.target.value)}
                  placeholder="https://"
                />
              </label>

              {formError ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              ) : null}

              <div className="flex items-center gap-3">
                <button
                  className="rounded-lg bg-foreground px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  className="rounded-lg border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-border/80 hover:text-foreground"
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <section className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Posts</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {posts.length} total
          </span>
        </div>

        {posts.length === 0 ? (
          <Card className="rounded-lg border border-border bg-card shadow-sm">
            <CardContent className="pt-4 text-sm text-muted-foreground">
              No posts yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                title={post.title}
                content={post.content}
                author={{ name: post.author.name, avatar: post.author.avatar }}
                createdAt={post.createdAt}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
