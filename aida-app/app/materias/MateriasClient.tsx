"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";
import { TablaMaterias } from "@/components/materias/tablaMaterias";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function MateriasClient() {
  const { usuario, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [materiasCursando, setMateriasCursando] = useState<any[]>([]);
  const [materiasDictando, setMateriasDictando] = useState<any[]>([]);
  const [esAlumno, setEsAlumno] = useState(false);
  const [esProfesor, setEsProfesor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const router = useRouter();

  async function cargarDatos() {
    try {
      if (!usuario) {
        setEsAlumno(false);
        setEsProfesor(false);
        setMateriasCursando([]);
        setMateriasDictando([]);
        return;
      }

      const alumno = usuario.esAlumno === true;
      const profesor = usuario.esProfesor === true;

      setEsAlumno(alumno);
      setEsProfesor(profesor);

      let matsCursando: any[] = [];
      let matsDictando: any[] = [];

      if (alumno) {
        matsCursando = await apiClient("/materiasQueCursa", {
          method: "GET",
        });
      }

      if (profesor) {
        matsDictando = await apiClient("/materiasQueDicta", {
          method: "GET",
        });
      }

      setMateriasCursando(matsCursando);
      setMateriasDictando(matsDictando);
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
            Materias que estas cursando
          </h1>
          <TablaMaterias
            Materias={materiasCursando}
            tipo="participacion"
            nombreCampoAux="Nota"
          />
        </>
      )}

      {esProfesor && (
        <>
          <h1 className="mb-8 text-3xl font-bold text-center">
            Materias que estas dictando
          </h1>
          <TablaMaterias
            Materias={materiasDictando}
            tipo="participacion"
            onAccion={(codigoMateria, cuatrimestre) =>
              router.push(
                `/alumnosPorMateria/${encodeURIComponent(
                  codigoMateria
                )}/${encodeURIComponent(cuatrimestre)}`
              )
            }
            nombreCampoAux="Accións"
          />
        </>
      )}

      {!esAlumno && !esProfesor && (
        <p className="text-center text-gray-600 mt-8">No tenés materias.</p>
      )}
    </>
  );
}
