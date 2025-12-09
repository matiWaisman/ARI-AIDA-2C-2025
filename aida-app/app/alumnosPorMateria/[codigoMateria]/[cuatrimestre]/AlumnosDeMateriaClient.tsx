"use client";

import { useEffect, useState } from "react";
import TablaAlumnosDeMateria from "@/components/materias/tablaAlumnosDeMateria";
import { apiClient } from "@/apiClient/apiClient";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { Alumno } from "@/types/alumno";

export default function AlumnosDeMateriaClient({
  alumnos,
  codigoMateria,
  cuatrimestre,
  error,
}: {
  alumnos: (Alumno & { nota: number })[];
  codigoMateria: string;
  cuatrimestre: string;
  error: string | null;
}) {
  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState<(Alumno & { nota: number })[]>(alumnos);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setLista(alumnos);
  }, [alumnos]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const ponerNotaAAlumno = async (
    lu: string,
    codigoMateria: string,
    cuatrimestre: string,
    nota: number
  ) => {
    setActionError(null);

    try {
      console.log("Datos que manda el front: ", { codigoMateria, cuatrimestre, lu, nota });
      const res = await apiClient("/materia/update", {
        method: "POST",
        body: JSON.stringify({ codigoMateria, cuatrimestre, lu, nota }),
      });

      setLista((prev) => prev.map((a) => (a.lu === lu ? { ...a, nota } : a)));

      return true;
    } catch (e: any) {
      setActionError(e.message || "Error desconocido");
      return false;
    }
  };

  if (loading) return <LoadingScreen mensaje="Cargando Alumnos" />;
  if (error) return <ErrorScreen error={error} />;
  if (actionError) return <ErrorScreen error={actionError} />;

  return (
    <TablaAlumnosDeMateria
      alumnos={lista}
      codigoMateria={codigoMateria}
      cuatrimestre={cuatrimestre}
      onPonerNota={ponerNotaAAlumno}
    />
  );
}
