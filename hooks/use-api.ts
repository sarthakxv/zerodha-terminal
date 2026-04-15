export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (res.status === 401) {
    const body = await res.json();
    if (body?.error === "session_expired") {
      throw new Error("session_expired");
    }
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
