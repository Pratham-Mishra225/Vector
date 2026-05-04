import bcrypt from "bcryptjs";
import { z } from "zod";

import { signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export async function GET() {
  return Response.json(
    { success: false, error: "Use POST to register" },
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

    const result = registerSchema.safeParse(json);
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
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return Response.json(
        {
          success: false,
          error: "Email already in use",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const createdUser = await User.create({
      name: data.name,
      email,
      password: passwordHash,
      bio: data.bio ?? "",
      avatar: data.avatar ?? "",
    });

    const token = signToken(createdUser._id.toString());

    return Response.json({
      success: true,
      data: {
        token,
        user: {
          id: createdUser._id.toString(),
          name: createdUser.name,
          email: createdUser.email,
          bio: createdUser.bio,
          avatar: createdUser.avatar,
        },
      },
    });
  } catch (error) {
    const mongoError = error as { code?: number };
    if (mongoError.code === 11000) {
      return Response.json(
        {
          success: false,
          error: "Email already in use",
        },
        { status: 400 }
      );
    }

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
        error: "Registration failed",
      },
      { status: 500 }
    );
  }
}
