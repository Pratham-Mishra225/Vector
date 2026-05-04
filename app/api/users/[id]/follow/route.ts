import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { Follow } from "@/models/Follow";

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

    const followingIds = follows.map((follow) => follow.following.toString());

    return Response.json({ success: true, data: { followingIds } });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Fetch following failed",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: targetUserId } = await params;

    if (targetUserId === userId) {
      return Response.json(
        {
          success: false,
          error: "Cannot follow yourself",
        },
        { status: 400 }
      );
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      following: targetUserId,
    }).lean();

    let following = false;

    if (existingFollow) {
      await Follow.deleteOne({ _id: existingFollow._id });
      following = false;
    } else {
      await Follow.create({ follower: userId, following: targetUserId });
      following = true;
    }

    return Response.json({ success: true, data: { following } });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Follow toggle failed",
      },
      { status: 500 }
    );
  }
}
