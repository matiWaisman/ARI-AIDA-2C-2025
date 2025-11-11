"use client";

import { useEffect, useState } from "react";
import Tabla from "@/components/tabla";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";

export default function AlumnosClient({
  alumnos,
  error,
}: {
  alumnos: any[];
  error: string | null;
}) {
  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState(alumnos);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Acciones
  const eliminarAlumno = async (lu: string) => {
    try {
      const res = await fetch(`/api/alumnos/delete?LU=${lu}`, { method: "POST" });
      if (!res.ok) throw new Error("Error al eliminar");
      setLista((prev) => prev.filter((a) => a.lu !== lu));
      return true;
    } catch (e: any) {
      setActionError(e.message);
      return false;
    }
  };

  const insertarAlumno = async (
    lu: string,
    nombres: string,
    apellido: string,
    titulo: string,
    titulo_en_tramite: string,
    egreso: string
  ) => {
    try {
      const res = await fetch("/api/alumnos/insert", {
        method: "POST",
        body: JSON.stringify({ lu, nombres, apellido, titulo, titulo_en_tramite, egreso }),
      });
      if (!res.ok) throw new Error("Error al insertar");
      const nuevo = await res.json();
      setLista((prev) => [...prev, nuevo]);
      return true;
    } catch (e: any) {
      setActionError(e.message);
      return false;
    }
  };

  const actualizarAlumno = async (lu: string, nombres: string, apellido: string) => {
    try {
      const res = await fetch("/api/alumnos/update", {
        method: "POST",
        body: JSON.stringify({ lu, nombres, apellido }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setLista((prev) => prev.map((a) => (a.lu === lu ? { ...a, nombres, apellido } : a)));
      return true;
    } catch (e: any) {
      setActionError(e.message);
      return false;
    }
  };

  if (loading) return <LoadingScreen mensaje="Cargando alumnos..." />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="w-full px-12 py-8">
      {actionError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {actionError}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Lista de Alumnos</h1>
      <p className="text-gray-600 mb-6">
        Total de alumnos: <span className="font-semibold text-blue-600">{lista.length}</span>
      </p>

      <Tabla
        alumnos={lista}
        onEliminar={eliminarAlumno}
        onInsertar={insertarAlumno}
        onActualizar={actualizarAlumno}
      />
    </div>
  );
}
