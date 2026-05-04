import { z } from "zod";

import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export async function POST(request: Request) {
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

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          error: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    const result = createPostSchema.safeParse(json);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const createdPost = await Post.create({
      title: result.data.title,
      content: result.data.content,
      author: userId,
    });

    return Response.json({
      success: true,
      data: {
        post: {
          id: createdPost._id.toString(),
          title: createdPost.title,
          content: createdPost.content,
          author: createdPost.author,
          createdAt: createdPost.createdAt,
          updatedAt: createdPost.updatedAt,
        },
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Create post failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10));
    const limit = Math.max(
      1,
      Number.parseInt(url.searchParams.get("limit") ?? "10", 10)
    );

    await connectDB();

    const total = await Post.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar")
      .lean();

    return Response.json({
      success: true,
      data: {
        posts,
        page,
        totalPages,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Fetch posts failed",
      },
      { status: 500 }
    );
  }
}
