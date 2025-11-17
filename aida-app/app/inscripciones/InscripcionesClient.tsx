"use client";

import { useEffect, useState } from "react";
import { TablaInscripciones } from "@/components/tablaInscripciones";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import session from "express-session";

export default function InscripcionesClient({
  materias,
  esAlumno,
  esProfesor,
  error,
}: {
  materias: any[];
  esAlumno: boolean;
  esProfesor: boolean;
  error: string | null;
}) {
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Acciones

  const inscribirseAMateria = async (codigoMateria: string, accion: string) => {
    try{
      const res = await fetch(`/api/materias/${accion}?codigoMateria=${codigoMateria}`, { method: "POST" , credentials: "include"});
      if(!res.ok) throw new Error(`Error al inscribirse a ${accion}`);
      return true;
    } catch (e:any) {
      setActionError(e.message);
      return false;
    }
    
  }

  if (loading) return <LoadingScreen mensaje="Cargando materias..." />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <>
      {esAlumno && 
        <>
          <h1 className="mb-8 text-3xl font-bold text-center">
            Inscribirse a materias
          </h1>

          <TablaInscripciones
            Materias={materias}
            tipo="alumno"
            onInscripcion={(codigo) => inscribirseAMateria(codigo, "cursar")}
          />
        </>
      }

      {esProfesor &&
        <>
          <h1 className="mb-8 text-3xl font-bold text-center">Dictar materias</h1>

          <TablaInscripciones
            Materias={materias}
            tipo="profesor"
            onInscripcion={(codigo) => inscribirseAMateria(codigo, "dictar")}
          />
        </>
      }
    </>
  );
}
