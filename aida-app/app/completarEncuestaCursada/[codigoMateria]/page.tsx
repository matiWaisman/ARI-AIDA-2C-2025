"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";
import { useUser } from "@/contexts/UserContext";

type Props = {
  params: Promise<{ codigoMateria: string }>;
};

export default function CompletarEncuestaCursadaPage({ params }: Props) {
  const unwrapped = use(params);
  const codigoMateria = unwrapped.codigoMateria;
  const { usuario } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compañeros, setCompañeros] = useState<any[]>([]);
  const [profesores, setProfesores] = useState<any[]>([]);
  useEffect(() => {
    async function cargarDatosEncuesta() {
      if (!usuario) {
        setLoading(false);
        return;
      }
      try {
        const compañerosResponse = await apiClient("/materias/alumnos", {
          method: "POST",
          body: JSON.stringify({ 
            codigoMateria,
            cuatrimestre: "2C-2025",
            luAExcluir: usuario.lu
          }),
        });
        setCompañeros(compañerosResponse);

        const profesoresResponse = await apiClient("/materias/profesores", {
          method: "POST",
          body: JSON.stringify({ 
            codigoMateria,
            cuatrimestre: "2C-2025"
          }),
        });
        setProfesores(profesoresResponse);
      } catch (e: any) {
        setError(e.message || "Error al cargar compañeros o profesores");
      } finally {
        setLoading(false);
      }
    }

    if (codigoMateria && usuario) {
      cargarDatosEncuesta();
    }
  }, [codigoMateria, usuario]);

  if (loading) return <LoadingScreen mensaje="Cargando compañeros..." />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div>
      <h1>Completar encuesta de {codigoMateria}</h1>

      <p className="mt-4 text-gray-700">
        Total de compañeros cargados: {compañeros.length}
        Total de profesores cargados: {profesores.length}
      </p>
    </div>
  );
}
