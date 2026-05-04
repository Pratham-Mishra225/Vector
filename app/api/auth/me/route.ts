import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function GET(request: Request) {
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

    const user = await User.findById(userId)
      .select("_id name email avatar")
      .lean();

    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: { user } });
  } catch {
    return Response.json(
      { success: false, error: "Fetch current user failed" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return Response.json({ success: false, error: "Not implemented" }, { status: 405 });
}
