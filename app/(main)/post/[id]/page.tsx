"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { apiFetch } from "@/lib/apiFetch";
import LikeButton from "@/components/LikeButton";
import { showToast } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";

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

type PostResponse = {
  success: boolean;
  data: {
    post: ApiPost;
    likeCount: number;
  };
};

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = typeof params.id === "string" ? params.id : params.id?.[0];
  const currentUser = useAuthStore((state) => state.user);

  const [post, setPost] = useState<ApiPost | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!postId) {
      return;
    }

    let isActive = true;

    const loadPost = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const result = await apiFetch<PostResponse>(`/posts/${postId}`);
        if (!isActive) {
          return;
        }

        setPost(result.data.post);
        setLikeCount(result.data.likeCount ?? 0);
      } catch (caught) {
        if (!isActive) {
          return;
        }

        const message =
          caught instanceof Error ? caught.message.toLowerCase() : "";
        setNotFound(message.includes("not found"));
        setPost(null);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      isActive = false;
    };
  }, [postId]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
          Loading post...
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-zinc-600">
          Post not found.
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const isAuthor = Boolean(currentUser && currentUser._id === post.author._id);

  const handleDelete = async () => {
    if (!postId || isDeleting) {
      return;
    }

    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await apiFetch(`/posts/${postId}`, { method: "DELETE" });
      showToast("Post deleted.", "success");
      router.push("/");
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Delete failed";
      showToast(message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <Link
            className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-2 transition hover:border-gray-300"
            href={`/profile/${post.author._id}`}
          >
            {post.author.avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={post.author.avatar}
                alt={`${post.author.name} avatar`}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold uppercase text-white">
                {post.author.name.slice(0, 1)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-zinc-800">{post.author.name}</span>
              <span className="text-xs text-zinc-500">{formattedDate}</span>
            </div>
          </Link>
          {isAuthor ? (
            <button
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          ) : null}
          <LikeButton postId={post._id} initialCount={likeCount} />
        </div>
      </header>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <ReactMarkdown className="space-y-5 text-lg leading-[1.8] text-zinc-700">
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
