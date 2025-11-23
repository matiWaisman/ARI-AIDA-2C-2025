const API_BASE = process.env.PUBLIC_API_BASE || "http://localhost:3000/app";

export function apiUrl(path: string): string {
  const baseUrl = API_BASE.endsWith("/") 
    ? API_BASE.slice(0, -1) 
    : API_BASE;
  const cleanPath = path.replace(/^\//, "");
  console.log(baseUrl);
  return `${baseUrl}/${cleanPath}`;
}

export async function apiFetch(inputPath: string, init?: RequestInit): Promise<Response> {
  const url = apiUrl(inputPath);
  console.log(url);
  return fetch(url, init);
}

