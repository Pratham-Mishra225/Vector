import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { Like } from "@/models/Like";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
  try {
    await connectDB();
    
    
    // Await the params object
    const { id } = await params; 

    const post = await Post.findById(id)
      .populate("author", "name avatar bio")
      .lean();

    if (!post) {
      return Response.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const likeCount = await Like.countDocuments({ post: id });

    return Response.json({
      success: true,
      data: {
        post,
        likeCount,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Fetch post failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let userId: string;
    try {
      userId = getAuthUser(request);
    } catch {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const post = await Post.findById(id);
    if (!post) {
      return Response.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author.toString() !== userId) {
      return Response.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await post.deleteOne();

    return Response.json({ success: true, message: "Post deleted" });
  } catch {
    return Response.json(
      { success: false, error: "Delete post failed" },
      { status: 500 }
    );
  }
}
