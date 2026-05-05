"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/apiFetch";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="space-y-4 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Explore
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground">
            Stories from the community
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Discover thoughtful writing from creators across the platform.
          </p>
        </div>
        <div className="h-px w-full bg-border/70" />
      </div>

      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={`explore-skeleton-${index}`}
              className="rounded-lg border border-border/70 bg-card shadow-sm"
            >
              <CardContent className="space-y-4 px-6 pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Card className="rounded-lg border border-destructive/30 bg-destructive/10">
            <CardContent className="px-6 pt-6 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card className="rounded-lg border border-border/70 bg-card">
            <CardContent className="px-6 pt-6 text-sm text-muted-foreground">
              No posts yet. Be the first to share a story.
            </CardContent>
          </Card>
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
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg px-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
          type="button"
          disabled={loading || page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg px-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
          type="button"
          disabled={loading || page >= totalPages}
          onClick={() =>
            setPage((current) => Math.min(totalPages, current + 1))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
