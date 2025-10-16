const NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export function apiUrl(path: string): string {
  if (NEXT_PUBLIC_API_BASE && NEXT_PUBLIC_API_BASE.length > 0) {
    return `${NEXT_PUBLIC_API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }
  // Default: use Next.js rewrite to backend via /api
  return `/api/${path.replace(/^\//, "")}`;
}

export async function apiFetch(inputPath: string, init?: RequestInit): Promise<Response> {
  const url = apiUrl(inputPath);
  return fetch(url, init);
}

