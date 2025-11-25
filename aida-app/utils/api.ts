const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

if (!API_BASE) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE no está definida. Por favor, configurá esta variable de entorno con la URL del backend."
  );
}

export function apiUrl(path: string): string {
  const baseUrl = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const cleanPath = path.replace(/^\//, "");
  console.log(baseUrl);
  return `${baseUrl}/${cleanPath}`;
}

export async function apiFetch(
  inputPath: string,
  init?: RequestInit
): Promise<Response> {
  const url = apiUrl(inputPath);
  console.log(url);
  return fetch(url, init);
}
