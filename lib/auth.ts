import jwt, { JwtPayload } from "jsonwebtoken";

export type AuthPayload = {
  userId: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
}

export function signToken(userId: string): string {
  const secret = getJwtSecret();
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret) as JwtPayload | string;

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  const userId = decoded.userId;
  if (typeof userId !== "string" || userId.length === 0) {
    throw new Error("Invalid token payload");
  }

  return { userId };
}

export function getAuthUser(req: Request): string {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    throw new Error("No cookies found");
  }

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);

  const token = cookies["token"];
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const { userId } = verifyToken(token);
  return userId;
}
