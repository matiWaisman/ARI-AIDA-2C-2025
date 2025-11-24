"use client";

import { useEffect, useState } from "react";
import { TablaMaterias } from "@/components/materias/tablaMaterias";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";
import { useUser } from "@/contexts/UserContext";

export default function InscripcionesClient() {
  const { usuario, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [materiasCursar, setMateriasCursar] = useState<any[]>([]);
  const [materiasDictar, setMateriasDictar] = useState<any[]>([]);
  const [esAlumno, setEsAlumno] = useState(false);
  const [esProfesor, setEsProfesor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCursar, setErrorCursar] = useState<string | null>(null);
  const [errorDictar, setErrorDictar] = useState<string | null>(null);

  async function cargarDatos() {
    try {
      if (!usuario) {
        setEsAlumno(false);
        setEsProfesor(false);
        setMateriasCursar([]);
        setMateriasDictar([]);
        return;
      }

      const alumno = usuario.esAlumno === true;
      const profesor = usuario.esProfesor === true;

      setEsAlumno(alumno);
      setEsProfesor(profesor);

      let matsCursar: any[] = [];
      let matsDictar: any[] = [];

      if (alumno) {
        matsCursar = await apiClient("/materiasQueNoCursa", {
          method: "GET",
        });
      }

      if (profesor) {
        matsDictar = await apiClient("/materiasQueNoDicta", {
          method: "GET",
        });
      }

      setMateriasCursar(matsCursar);
      setMateriasDictar(matsDictar);
    } catch (e: any) {
      setError(e.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userLoading) {
      cargarDatos();
    }
  }, [userLoading, usuario]);

  const inscribirseACursar = async (codigo: string) => {
    setErrorCursar(null);
    if (!codigo || codigo === "undefined") {
      setErrorCursar("Código de materia inválido");
      return false;
    }
    try {
      await apiClient(
        `/materias/cursar?codigoMateria=${encodeURIComponent(codigo)}`,
        { method: "POST" }
      );
      cargarDatos();
      return true;
    } catch (e: any) {
      setErrorCursar(e.message);
      return false;
    }
  };

  const inscribirseADictar = async (codigo: string) => {
    setErrorDictar(null);
    if (!codigo || codigo === "undefined") {
      setErrorDictar("Código de materia inválido");
      return false;
    }
    try {
      await apiClient(
        `/materias/dictar?codigoMateria=${encodeURIComponent(codigo)}`,
        { method: "POST" }
      );
      cargarDatos();
      return true;
    } catch (e: any) {
      setErrorDictar(e.message);
      return false;
    }
  };

  if (loading) return <LoadingScreen mensaje="Cargando materias..." />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <>
      {esAlumno && (
        <>
          <h1 className="mb-8 text-3xl font-bold text-center">
            Inscribirse a materias
          </h1>
          <TablaMaterias
            Materias={materiasCursar}
            tipo="inscripcion"
            onAccion={(codigo) => inscribirseACursar(codigo)}
            nombreCampoAux="Acción"
          />
          {errorCursar && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-md">
              <h2 className="font-bold text-lg mb-2">Error</h2>
              <p>{errorCursar}</p>
            </div>
          )}
        </>
      )}

      {esProfesor && (
        <>
          <h1 className="mb-8 mt-8 text-3xl font-bold text-center">
            Dictar materias
          </h1>
          <TablaMaterias
            Materias={materiasDictar}
            tipo="inscripcion"
            onAccion={(codigo) => inscribirseADictar(codigo)}
            nombreCampoAux="Acción"
          />
          {errorDictar && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-md">
              <h2 className="font-bold text-lg mb-2">Error</h2>
              <p>{errorDictar}</p>
            </div>
          )}
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
