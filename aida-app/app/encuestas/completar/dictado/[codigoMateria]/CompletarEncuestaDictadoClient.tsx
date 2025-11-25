"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";
import { useUser } from "@/contexts/UserContext";
import EncuestaDesplegable from "@/components/encuestas/completarEncuestas/encuestaDesplegable";
import { preguntasCompañeros } from "@/app/encuestas/preguntas";
import { useEncuestasPersonas } from "@/features/completarEncuestasFeature";

type Props = {
  codigoMateria: string;
};

export default function CompletarEncuestaDictadoClient({
  codigoMateria,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const nombreMateria = searchParams.get("nombreMateria") || codigoMateria;
  const cuatrimestre = searchParams.get("cuatrimestre") || "2C2025";
  const { usuario } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [enviando, setEnviando] = useState(false);

  const encuestasAlumnos = useEncuestasPersonas({
    evaluados: alumnos,
    numPreguntas: preguntasCompañeros.length,
    endpoint: "/encuestas/create/alumno",
    tipoEncuesta: "alumno",
  });

  useEffect(() => {
    async function cargarDatosEncuesta() {
      if (!usuario) {
        setLoading(false);
        return;
      }
      try {
        const alumnosResponse = await apiClient("/materias/alumnos", {
          method: "POST",
          body: JSON.stringify({
            codigoMateria,
            cuatrimestre,
            luAExcluir: usuario.lu,
          }),
        });
        setAlumnos(alumnosResponse);
      } catch (e: any) {
        setError(e.message || "Error al cargar alumnos");
      } finally {
        setLoading(false);
      }
    }

    if (codigoMateria && usuario) {
      cargarDatosEncuesta();
    }
  }, [codigoMateria, usuario, cuatrimestre]);

  const handleEnviarTodo = async () => {
    setEnviando(true);
    setError(null);

    try {
      const luEncuestado = usuario!.lu;

      await encuestasAlumnos.enviarEncuestas(
        luEncuestado,
        codigoMateria,
        cuatrimestre
      );

      alert("Encuesta de dictado completada exitosamente");
      router.push("/encuestas/completar");
    } catch (e: any) {
      setError(e.message || "Error al enviar las encuestas");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <LoadingScreen mensaje="Cargando alumnos..." />;
  if (error && !enviando) return <ErrorScreen error={error} />;

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Completar encuesta de dictado de {nombreMateria} {cuatrimestre}
      </h1>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Encuestas a alumnos ({alumnos.length})
          </h2>
          {alumnos.length > 0 && (
            <button
              onClick={encuestasAlumnos.completarAleatorio}
              className="px-4 py-2 bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Completar aleatorio
            </button>
          )}
        </div>
        {alumnos.length === 0 ? (
          <p className="text-gray-500">No hay alumnos para evaluar</p>
        ) : (
          alumnos.map((alumno) => {
            const respuesta = encuestasAlumnos.respuestas.get(alumno.lu);
            return (
              <EncuestaDesplegable
                key={alumno.lu}
                titulo={`${alumno.nombres || ""} ${
                  alumno.apellido || ""
                } (LU: ${alumno.lu})`.trim()}
                preguntas={preguntasCompañeros}
                respuestasIniciales={respuesta?.respuestas}
                comentarioInicial={respuesta?.comentario}
                onRespuestasChange={(respuestas, comentario) =>
                  encuestasAlumnos.actualizarRespuesta(
                    alumno.lu,
                    respuestas,
                    comentario
                  )
                }
              />
            );
          })
        )}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleEnviarTodo}
          disabled={enviando}
          className={`px-8 py-3 rounded-lg text-white font-semibold text-lg transition-colors ${
            enviando
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-600 active:bg-sky-700"
          }`}
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </div>

      {error && enviando && (
        <div className="mt-4 text-center text-red-600">{error}</div>
      )}
    </div>
  );
}


