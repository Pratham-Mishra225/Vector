import { connectDB } from "@/lib/db";
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
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: post });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Fetch post failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
