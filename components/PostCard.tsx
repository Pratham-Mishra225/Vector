import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type PostCardProps = {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likeCount?: number;
};

export default function PostCard({
  id,
  title,
  content,
  author,
  createdAt,
  likeCount,
}: PostCardProps) {
  const preview = content.length > 120 ? `${content.slice(0, 120)}...` : content;
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <Link className="block" href={`/post/${id}`}>
      <Card className="rounded-lg border border-border bg-card text-card-foreground shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-md">
        <CardHeader className="gap-3 px-6 pt-6">
          <div className="flex items-center gap-3">
            {author.avatar ? (
              <img
                className="h-9 w-9 rounded-full object-cover"
                src={author.avatar}
                alt={`${author.name} avatar`}
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold uppercase text-background">
                {author.name.slice(0, 1)}
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-foreground">
                {author.name}
              </span>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
          </div>

          <CardTitle className="text-2xl font-semibold leading-tight text-foreground">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6">
          <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {preview}
          </CardDescription>
        </CardContent>

        <CardFooter className="justify-between border-t border-border/60 bg-muted/30 px-6">
          <span className="text-xs text-muted-foreground">{readTime} min read</span>
          <div
            onClick={(event) => event.preventDefault()}
            role="presentation"
          >
            <LikeButton postId={id} initialCount={likeCount ?? 0} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
