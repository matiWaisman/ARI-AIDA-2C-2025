"use client";

import { useEffect, useState } from "react";
import Menu from "@/components/menu";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";

export default function CompletarEncuestaPage() {
  const [loading, setLoading] = useState(true);
  const [esAlumno, setEsAlumno] = useState(false);
  const [esProfesor, setEsProfesor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [menuOptionsAlumno, setMenuOptionsAlumno] = useState<Map<string, [string, string]>>(new Map());
  const [menuOptionsProfesor, setMenuOptionsProfesor] = useState<Map<string, [string, string]>>(new Map());

  useEffect(() => {
    async function cargarDatos() {
      try {
        const matsQueCursa = await apiClient("/materiasQueCursa", { method: "GET" });
        const matsQueDicta = await apiClient("/materiasQueDicta", { method: "GET" });
        const alumno = await apiClient("/esAlumno", { method: "GET" });
        const profesor = await apiClient("/esProfesor", { method: "GET" });
        setEsAlumno(alumno);
        setEsProfesor(profesor);

        const alumnoMap = new Map();
        for (const materia of matsQueCursa) {
          console.log("Materia que cursa: ", materia);
          alumnoMap.set(
            `Completar encuesta de ${materia.nombremateria}`,
            [
              `/completarEncuesta/${materia.codigomateria}`,
              `Completar encuesta de ${materia.nombremateria}`,
            ]
          );
        }
        console.log("Alumno Map: ", alumnoMap);

        const profesorMap = new Map();
        for (const materia of matsQueDicta) {
          profesorMap.set(
            `Completar encuesta de ${materia.nombreMateria}`,
            [
              `/completarEncuesta/${materia.codigoMateria}`,
              `Completar encuesta de ${materia.nombreMateria}`,
            ]
          );
        }

        setMenuOptionsAlumno(alumnoMap);
        setMenuOptionsProfesor(profesorMap);
      } catch (e: any) {
        setError(e.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  if (loading) return <LoadingScreen mensaje="Cargando materias..." />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <>
      {actionError && (
        <p className="text-red-500 text-center mb-4">{actionError}</p>
      )}

      {esAlumno && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Completar encuestas de tus cursadas</h1>
          <Menu options={menuOptionsAlumno} />
        </div>
      )}

      {esProfesor && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Completar encuestas de tus materias dictadas</h1>
          <Menu options={menuOptionsProfesor} />
        </div>
      )}

      {!esAlumno && !esProfesor && (
        <p className="text-center text-gray-600 mt-8">
          No tenés permisos para ver inscripciones.
        </p>
      )}
    </>
  );
}
