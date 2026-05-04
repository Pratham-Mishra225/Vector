import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { Follow } from "@/models/Follow";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    let userId: string;
    try {
      userId = getAuthUser(request);
    } catch (error) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const follows = await Follow.find({ follower: userId })
      .select("following")
      .lean();

    const followingIds = follows.map((follow) => follow.following);

    if (followingIds.length === 0) {
      return Response.json({ success: true, data: { posts: [] } });
    }

    const posts = await Post.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("author", "name avatar")
      .lean();

    return Response.json({ success: true, data: { posts } });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Fetch following feed failed",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return Response.json(
    { success: false, error: "Not implemented" },
    { status: 405 }
  );
}
