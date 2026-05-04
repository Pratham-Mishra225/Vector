export async function hashPassword(_password: string): Promise<string> {
  // TODO: implement password hashing.
  return "";
}

export async function verifyPassword(
  _password: string,
  _hash: string
): Promise<boolean> {
  // TODO: implement password verification.
  return false;
}

export function signToken(_payload: Record<string, unknown>): string {
  // TODO: implement JWT signing.
  return "";
}

export function verifyToken<T extends object>(_token: string): T | null {
  // TODO: implement JWT verification.
  return null;
}
