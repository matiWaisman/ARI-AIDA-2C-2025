"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiClient";
import { Materia } from "@/types/materia";

export function useMateriasFeature() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarMaterias = async () => {
    try {
      const data = await apiClient("/materias", { method: "GET" });
      console.log("Datos de materias obtenidos: ", data);
      setMaterias(data);
      setError(null);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      await cargarMaterias();
      if (!isMounted) return;
    })();

    return () => { isMounted = false; };
  }, []);

  
  return {
    materias: materias,
    error,
    loading
  };
}

