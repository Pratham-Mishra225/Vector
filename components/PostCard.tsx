import Link from "next/link";

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

  return (
    <Link
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:scale-[1.01] hover:shadow-md"
      href={`/post/${id}`}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600">
            {preview}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-zinc-500">
          <div className="flex items-center gap-3">
            {author.avatar ? (
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={author.avatar}
                alt={`${author.name} avatar`}
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold uppercase text-white">
                {author.name.slice(0, 1)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-zinc-700">{author.name}</span>
              <span className="text-xs text-zinc-500">{formattedDate}</span>
            </div>
          </div>

          {typeof likeCount === "number" ? (
            <span className="text-xs text-zinc-500">{likeCount} likes</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
