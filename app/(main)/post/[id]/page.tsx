"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { apiFetch } from "@/lib/apiFetch";
import LikeButton from "@/components/LikeButton";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const currentUser = useAuth().user;

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
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading post...
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
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
        <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link
            className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 transition hover:border-border/80"
            href={`/profile/${post.author._id}`}
          >
            {post.author.avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={post.author.avatar}
                alt={`${post.author.name} avatar`}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-xs font-semibold uppercase text-background">
                {post.author.name.slice(0, 1)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{post.author.name}</span>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
          </Link>
          {isAuthor ? (
            <button
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-destructive transition hover:border-destructive/40 hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="mt-6 border-t border-border pt-6">
        <ReactMarkdown className="space-y-5 text-lg leading-[1.8] text-foreground/80">
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
