import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { Like } from "@/models/Like";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    { success: false, error: "Not implemented" },
    { status: 405 }
  );
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

    const { id } = await params;

    const existingLike = await Like.findOne({ user: userId, post: id }).lean();
    let liked = false;

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      liked = false;
    } else {
      await Like.create({ user: userId, post: id });
      liked = true;
    }

    const likeCount = await Like.countDocuments({ post: id });

    return Response.json({
      success: true,
      data: {
        liked,
        likeCount,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Like toggle failed",
      },
      { status: 500 }
    );
  }
}
