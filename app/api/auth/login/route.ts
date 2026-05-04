import bcrypt from "bcryptjs";
import { z } from "zod";

import { signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function GET() {
  return Response.json({ success: false, message: "Use POST to login" });
}

export async function POST(request: Request) {
  try {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON body",
          details: "Send a valid JSON object in the request body.",
        },
        { status: 400 }
      );
    }

    const result = loginSchema.safeParse(json);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten(),
          details: "Check the highlighted fields and try again.",
        },
        { status: 400 }
      );
    }

    const data = result.data;

    await connectDB();

    const email = data.email.toLowerCase();
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
          details: "Check your email and password and try again.",
        },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
          details: "Check your email and password and try again.",
        },
        { status: 401 }
      );
    }

    const token = signToken(user._id.toString());

    return Response.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("JWT_SECRET")) {
      return Response.json(
        {
          success: false,
          message: "Server configuration error",
          details: "JWT_SECRET is missing on the server.",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Login failed",
        details: "Unexpected server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
