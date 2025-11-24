"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiClient";
import RespuestaEncuestaDesplegable from "@/components/respuestasEncuestaDesplegable";

const tipoEncuestaLabels: Record<"materia" | "profesores" | "alumnos", string> =
  {
    materia: "Resultados de las encuestas de la Materia",
    profesores: "Resultados de las encuestas de Profesores",
    alumnos: "Resultados de las encuestas de Alumnos",
  };

export default function VerEncuestasPorMateriaYTipoClient({
  codigoMateria,
  cuatrimestre,
  tipoEncuesta,
  nombreMateria,
}: {
  codigoMateria: string;
  cuatrimestre: string;
  tipoEncuesta: "materia" | "profesores" | "alumnos";
  nombreMateria: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [encuestas, setEncuestas] = useState<any[]>([]);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const resultadosEcuestas = await apiClient(
          `/encuestas/get/${tipoEncuesta}/${codigoMateria}/${cuatrimestre}`,
          { method: "GET" }
        );
        setEncuestas(resultadosEcuestas);
      } catch (e: any) {
        setError(e.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [codigoMateria, cuatrimestre, tipoEncuesta]);

  const seccionLabel = tipoEncuestaLabels[tipoEncuesta];

  return (
    <div className="text-center">
      {nombreMateria && (
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {nombreMateria} ({cuatrimestre}) - {seccionLabel}
        </h1>
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {encuestas.length === 0 && !loading && (
        <p className="text-gray-500">No hay encuestas completas</p>
      )}

      {encuestas.map((encuesta, index) => (
        <RespuestaEncuestaDesplegable
          key={index}
          encuesta={encuesta}
          tipoEncuesta={tipoEncuesta}
        />
      ))}
    </div>
  );
}
