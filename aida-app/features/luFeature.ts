"use client";

import { useState } from "react";
import { apiClient } from "@/apiClient/apiClient";

export function useLuFeature() {
  const [lu, setLu] = useState("");
  const [alumno, setAlumno] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buscarAlumnoPorLU(event?: React.FormEvent) {
    if (event) event.preventDefault();
    setError(null);
    setLoading(true);
    setAlumno(null);

    try {
      const res = await apiClient(`/lu?LU=${encodeURIComponent(lu)}`, {
        method: "GET",
      });
      setAlumno(res);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al buscar alumno");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    lu,
    setLu,
    alumno,
    loading,
    error,
    buscarAlumnoPorLU,
  };
}
