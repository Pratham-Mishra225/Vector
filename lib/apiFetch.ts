export async function apiFetch(
  _path: string,
  _init?: RequestInit
): Promise<Response> {
  // TODO: add base URL, auth headers, and error handling.
  return fetch(_path, _init);
}
