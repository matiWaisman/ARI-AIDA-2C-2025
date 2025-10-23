
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
    throw new Error(err.message || `Error ${res.status}`);
  }

  return res.json();
}
