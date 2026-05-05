"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/apiFetch";
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

type PostsResponse = {
  success: boolean;
  data: {
    posts: ApiPost[];
    page: number;
    totalPages: number;
  };
};

export default function ExplorePage() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFetch<PostsResponse>(`/posts?page=${page}`);

        if (!isActive) {
          return;
        }

        setPosts(result.data.posts);
        setTotalPages(result.data.totalPages || 1);
      } catch (caught) {
        if (!isActive) {
          return;
        }

        setError(caught instanceof Error ? caught.message : "Failed to load posts");
        setPosts([]);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isActive = false;
    };
  }, [page]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Explore</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Stories from the community.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
          Page {page} of {totalPages}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
            Loading posts...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
            No posts yet. Be the first to share a story.
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

      <div className="mt-10 flex items-center justify-between">
        <button
          className="rounded-full border border-zinc-900 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={loading || page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous
        </button>
        <button
          className="rounded-full border border-zinc-900 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={loading || page >= totalPages}
          onClick={() =>
            setPage((current) => Math.min(totalPages, current + 1))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
