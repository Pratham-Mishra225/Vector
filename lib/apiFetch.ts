export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const url = baseUrl ? `${baseUrl}${path}` : path;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };
      if (data?.error) {
        message = data.error;
      } else if (data?.message) {
        message = data.message;
      }
    } catch {
      // Ignore JSON parsing errors and fall back to status message.
    }

    throw new Error(message);
  }

  try {
    return (await response.json()) as T;
  } catch {
    return undefined as T;
  }
}
