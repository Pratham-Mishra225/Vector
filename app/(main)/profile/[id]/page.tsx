"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";
import { useAuthStore } from "@/store/authStore";
import FollowButton from "@/components/FollowButton";
import PostCard from "@/components/PostCard";

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
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
          Loading profile...
        </div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
          User not found.
        </div>
      </div>
    );
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isOwnProfile = Boolean(authUser && authUser._id === user._id);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <section className="flex flex-col gap-6 rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={user.avatar}
                alt={`${user.name} avatar`}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-lg font-semibold uppercase text-white">
                {user.name.slice(0, 1)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">
                {user.name}
              </h1>
              <p className="text-sm text-zinc-500">Joined {formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOwnProfile ? (
              <Link
                className="rounded-full border border-zinc-900 px-4 py-1 text-xs uppercase tracking-[0.2em] transition hover:bg-zinc-900 hover:text-white"
                href="#"
              >
                Edit Profile
              </Link>
            ) : (
              <FollowButton
                targetUserId={user._id}
                initialFollowing={initialFollowing}
              />
            )}
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600">
          {user.bio?.length ? user.bio : "This user has not added a bio yet."}
        </p>
      </section>

      <section className="mt-10 space-y-6">
        <h2 className="text-lg font-semibold text-zinc-900">Posts</h2>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
            No posts yet.
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              title={post.title}
              content={post.content}
              author={{ name: post.author.name, avatar: post.author.avatar }}
              createdAt={post.createdAt}
            />
          ))
        )}
      </section>
    </div>
  );
}
