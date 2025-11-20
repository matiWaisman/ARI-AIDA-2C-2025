"use client";

import { useEffect, useState } from "react";
import { TablaInscripciones } from "@/components/tablaInscripciones";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";

export default function InscripcionesClient() {
  const [loading, setLoading] = useState(true);
  const [materiasCursar, setMateriasCursar] = useState<any[]>([]);
  const [materiasDictar, setMateriasDictar] = useState<any[]>([]);
  const [esAlumno, setEsAlumno] = useState(false);
  const [esProfesor, setEsProfesor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const matsCursar = await apiClient("/materiasQueNoCursa", { method: "GET" });
        const matsDictar = await apiClient("/materiasQueNoDicta", { method: "GET" });
        const alumno = await apiClient("/esAlumno", { method: "GET" });
        const profesor = await apiClient("/esProfesor", { method: "GET" });

        setMateriasCursar(matsCursar);
        setMateriasDictar(matsDictar);
        setEsAlumno(alumno);
        setEsProfesor(profesor);

      } catch (e: any) {
        setError(e.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  const inscribirseAMateria = async (codigo: string, accion: string) => {
    try {
      await apiClient(`/materias/${accion}?codigoMateria=${codigo}`, {
        method: "POST",
      });
      return true;
    } catch (e: any) {
      setActionError(e.message);
      return false;
    }
  };

  if (loading) return <LoadingScreen mensaje="Cargando materias..." />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <>
      {actionError && (
        <p className="text-red-500 text-center mb-4">{actionError}</p>
      )}

      {esAlumno && (
        <>
          <h1 className="mb-8 text-3xl font-bold text-center">
            Inscribirse a materias
          </h1>
          <TablaInscripciones
            Materias={materiasCursar}
            tipo="alumno"
            onInscripcion={(codigo) =>
              inscribirseAMateria(codigo, "cursar")
            }
          />
        </>
      )}

      {esProfesor && (
        <>
          <h1 className="mb-8 text-3xl font-bold text-center">
            Dictar materias
          </h1>
          <TablaInscripciones
            Materias={materiasDictar}
            tipo="profesor"
            onInscripcion={(codigo) =>
              inscribirseAMateria(codigo, "dictar")
            }
          />
        </>
      )}

      {!esAlumno && !esProfesor && (
        <p className="text-center text-gray-600 mt-8">
          No tenés permisos para ver inscripciones.
        </p>
      )}
    </>
  );
}
