import { apiFetch } from "@/utils/api";

export async function apiClient(path: string, options: RequestInit = {}) {
  const res = await apiFetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message =
      (err && (err.error || err.message)) || `Error ${res.status}`;
    const error = new Error(message);
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
}
