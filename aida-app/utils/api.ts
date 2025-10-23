const NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export function apiUrl(path: string): string {
  return `http://localhost:3000/app/${path.replace(/^\//, "")}`;
}

export async function apiFetch(inputPath: string, init?: RequestInit): Promise<Response> {
  const url = apiUrl(inputPath);
  return fetch(url, init);
}

