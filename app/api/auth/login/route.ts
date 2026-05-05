import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";

import { signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function GET() {
  return Response.json(
    { success: false, error: "Use POST to login" },
    { status: 405 }
  );
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
          error: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    const result = loginSchema.safeParse(json);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
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
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return Response.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const token = signToken(user._id.toString());

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
        },
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("JWT_SECRET")) {
      return Response.json(
        {
          success: false,
          error: "Server configuration error",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 }
    );
  }
}
