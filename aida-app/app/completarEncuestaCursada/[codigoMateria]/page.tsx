"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";

type Props = {
  params: Promise<{ codigoMateria: string }>;
};

export default function CompletarEncuestaCursadaPage({ params }: Props) {
  const unwrapped = use(params);
  const codigoMateria = unwrapped.codigoMateria;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companeros, setCompaneros] = useState<any[]>([]);

  useEffect(() => {
    async function cargarCompaneros() {
      try {
        const compañeros = await apiClient("/materia/alumnos", {
          method: "POST",
          body: JSON.stringify({ codigoMateria }),
        });
        console.log(compañeros);
        setCompaneros(compañeros);
      } catch (e: any) {
        setError(e.message || "Error al cargar compañeros");
      } finally {
        setLoading(false);
      }
    }

    cargarCompaneros();
  }, [codigoMateria]);

  if (loading) return <LoadingScreen mensaje="Cargando compañeros..." />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div>
      <h1>Completar encuesta de {codigoMateria}</h1>

      <p className="mt-4 text-gray-700">
        Total de compañeros cargados: {companeros.length}
      </p>
    </div>
  );
}
