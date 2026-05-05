import { z } from "zod";

import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { Post } from "@/models/Post";
import { User } from "@/models/User";

export const runtime = "nodejs";

const updateProfileSchema = z.object({
  bio: z.string().trim().max(280).optional(),
  avatar: z.string().trim().max(500).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const posts = await Post.find({ author: id })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar")
      .lean();

    return Response.json({ success: true, data: { user, posts } });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Fetch user failed",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const { id } = await params;
    if (userId !== id) {
      return Response.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
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

    const result = updateProfileSchema.safeParse(json);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
        },
        { status: 400 }
      );
    }

    const updates: { bio?: string; avatar?: string } = {};
    if (result.data.bio !== undefined) {
      updates.bio = result.data.bio;
    }
    if (result.data.avatar !== undefined) {
      updates.avatar = result.data.avatar;
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { success: false, error: "No updates provided" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(id, updates, { new: true })
      .select("-password")
      .lean();

    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Update profile failed",
      },
      { status: 500 }
    );
  }
}
