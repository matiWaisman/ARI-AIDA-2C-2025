"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiClient";
import { Alumno } from "@/types/alumno";

export function useAlumnosFeature() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarAlumnos = async () => {
    try {
      const data = await apiClient("/all", { method: "GET" });
      setAlumnos(data);
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
      await cargarAlumnos();
      if (!isMounted) return;
    })();

    return () => { isMounted = false; };
  }, []);

  const eliminarAlumno = async (lu: string) => {
    try {
      await apiClient(`/delete?LU=${encodeURIComponent(lu)}`, {
        method: "POST",
      });
      await cargarAlumnos();
      return true;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error al eliminar el alumno");
      }
      return false;
    }
  };

  const insertarAlumno = async (lu: string, nombres: string, apellido: string, titulo: string, titulo_en_tramite: string, egreso: string) => {
    try {
      await apiClient("/insert", {
        method: "POST",
        body: JSON.stringify({ 
          lu, 
          nombres, 
          apellido,
          titulo,
          titulo_en_tramite,
          egreso
        }),
      });
      await cargarAlumnos();
      return true;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error al insertar el alumno");
      }
      return false;
    }
  };

  const actualizarAlumno = async (lu: string, nombres: string, apellido: string) => {
    try {
      await apiClient("/update", {
        method: "POST",
        body: JSON.stringify({ lu, nombres, apellido }),
      });
      await cargarAlumnos();
      return true;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error al actualizar el alumno");
      }
      return false;
    }
  };

  return {
    alumnos,
    error,
    loading,
    eliminarAlumno,
    insertarAlumno,
    actualizarAlumno,
  };
}

