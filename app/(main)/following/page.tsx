"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";
import { useAuthStore } from "@/store/authStore";
import PostCard from "@/components/PostCard";

type ApiAuthor = {
  _id: string;
  name: string;
  avatar: string;
};

type ApiPost = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: ApiAuthor;
};

type FollowingResponse = {
  success: boolean;
  data: {
    posts: ApiPost[];
  };
};

export default function FollowingPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hydrate = useAuthStore((state) => state.hydrate);

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;

    const loadFeed = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFetch<FollowingResponse>("/feed/following");

        if (!isActive) {
          return;
        }

        setPosts(result.data.posts);
      } catch (caught) {
        if (!isActive) {
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Failed to load following feed"
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadFeed();

    return () => {
      isActive = false;
    };
  }, [token]);

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
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">Following</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Fresh posts from authors you follow.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
            Loading feed...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
            Follow some authors to see posts.
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
      </div>
    </div>
  );
}
