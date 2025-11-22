"use client";

import { useEffect, useState } from "react";
import Menu from "@/components/menu";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";

export default function CompletarEncuestasPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuCursadas, setMenuCursadas] = useState<
    Map<string, [string, string]>
  >(new Map());
  const [menuDictados, setMenuDictados] = useState<
    Map<string, [string, string]>
  >(new Map());

  useEffect(() => {
    async function cargarDatos() {
      try {
        const encuestas = await apiClient(
          "/completarEncuestas/encuestasPendientes",
          { method: "GET" }
        );

        const cursadasMap = new Map();
        const dictadosMap = new Map();

        for (const e of encuestas) {
          const titulo = `Completar encuesta de ${e.nombreMateria}`;
          if (e.tipoEncuesta === "encuestaAMateria") {
            const ruta = `/completarEncuestaCursada/${encodeURIComponent(e.codigoMateria)}`;
            cursadasMap.set(titulo, [ruta, titulo]);
          } else {
            const ruta = `/completarEncuestaDictado/${encodeURIComponent(e.codigoMateria)}`;
            dictadosMap.set(titulo, [ruta, titulo]);
          }
        }

        setMenuCursadas(cursadasMap);
        setMenuDictados(dictadosMap);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  if (loading) return <LoadingScreen mensaje="Cargando encuestas..." />;
  if (error) return <ErrorScreen error={error} />;

  const hayCursadas = menuCursadas.size > 0;
  const hayDictados = menuDictados.size > 0;

  return (
    <>
      {!hayCursadas && !hayDictados && (
        <p className="text-center text-gray-600 mt-8">
          No tenés encuestas pendientes.
        </p>
      )}

      {hayCursadas && (
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Completar encuestas de tus cursadas
          </h1>
          <Menu options={menuCursadas} />
        </div>
      )}

      {hayDictados && (
        <div className="text-center mt-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Completar encuestas que te deben completar
          </h1>
          <Menu options={menuDictados} />
        </div>
      )}
    </>
  );
}
