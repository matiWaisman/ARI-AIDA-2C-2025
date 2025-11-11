"use client";

import { useEffect, useState } from "react";
import { TablaInscripciones } from "@/components/tablaInscripciones";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";

export default function InscripcionesClient({
  materias,
  error,
}: {
  materias: any[];
  error: string | null;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingScreen mensaje="Cargando materias..." />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-center">
        Inscribirse a materias
      </h1>

      <TablaInscripciones
        Materias={materias}
        tipo="alumno"
        onInscripcion={(codigo) => console.log("Inscripto:", codigo)}
      />

      <h1 className="mb-8 text-3xl font-bold text-center">Dictar materias</h1>

      <TablaInscripciones
        Materias={materias}
        tipo="profesor"
        onInscripcion={(codigo) => console.log("Inscripto:", codigo)}
      />
    </>
  );
}
