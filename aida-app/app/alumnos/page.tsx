"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiClient";

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // Ensure session is established (avoids race right after login)
        await apiClient("/session", { method: "GET" });

        const data = await apiClient("/all", { method: "GET" });
        if (isMounted) setAlumnos(data);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
        else setError("Error desconocido");
      }
    })();
    return () => { isMounted = false; };
  }, []);

  if (error) return <div>{error}</div>;
  return (
    <div>
      Hola papu
    </div>
  );
}
