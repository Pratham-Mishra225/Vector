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
};

export default function PostCard({
  id,
  title,
  content,
  author,
  createdAt,
}: PostCardProps) {
  const preview = content.length > 120 ? `${content.slice(0, 120)}...` : content;
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      className="block rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg"
      href={`/post/${id}`}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
          <p className="text-sm leading-relaxed text-zinc-600">{preview}</p>
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-500">
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
      </div>
    </Link>
  );
}
