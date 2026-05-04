type ApiFetchOptions = RequestInit & {
  baseUrl?: string;
};

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const baseUrl = options.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  const url = baseUrl ? `${baseUrl}${path}` : path;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // Ignore JSON parsing errors and fall back to status message.
    }

    throw new Error(message);
  }

  return response;
}
