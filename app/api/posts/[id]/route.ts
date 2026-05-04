import { connectDB } from "@/lib/db";
import { Like } from "@/models/Like";
import { Post } from "@/models/Post";

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
