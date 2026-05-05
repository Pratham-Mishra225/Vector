"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostCard from "@/components/PostCard";
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

type FollowingResponse = {
  success: boolean;
  data: {
    posts: ApiPost[];
  };
};

export default function FollowingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace("/login");
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
  }, [authLoading, user, router]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12 text-sm text-muted-foreground">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="space-y-4 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Following
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground">
            Fresh posts from authors you follow
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your personal feed of new stories, updates, and insights.
          </p>
        </div>
        <div className="h-px w-full bg-border/70" />
      </div>

      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={`following-skeleton-${index}`}
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
              Follow some authors to see posts.
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
    </div>
  );
}
