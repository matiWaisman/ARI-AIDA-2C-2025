"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";
import { useUser } from "@/contexts/UserContext";
import EncuestaDesplegable from "@/components/encuestas/completarEncuestas/encuestaDesplegable";
import {
  preguntasCompañeros,
  preguntasProfesores,
  preguntasMateria,
} from "@/app/encuestas/preguntas";
import {
  useEncuestasPersonas,
  useEncuestaMateria,
} from "@/features/completarEncuestasFeature";
import { Alumno } from "@/types/alumno";

type Props = {
  codigoMateria: string;
};

export default function CompletarEncuestaCursadaClient({
  codigoMateria,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const nombreMateria = searchParams.get("nombreMateria") || codigoMateria;
  const cuatrimestre = searchParams.get("cuatrimestre") || "2C2025";
  const { usuario } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compañeros, setCompañeros] = useState<Alumno[]>([]);
  const [profesores, setProfesores] = useState<any[]>([]);
  const [enviando, setEnviando] = useState(false);

  const encuestasCompañeros = useEncuestasPersonas({
    evaluados: compañeros,
    numPreguntas: preguntasCompañeros.length,
    endpoint: "/encuestaAAlumno/create",
    tipoEncuesta: "alumno",
  });

  const encuestasProfesores = useEncuestasPersonas({
    evaluados: profesores,
    numPreguntas: preguntasProfesores.length,
    endpoint: "/encuestaAProfesor/create",
    tipoEncuesta: "profesor",
  });

  const encuestaMateria = useEncuestaMateria({
    numPreguntas: preguntasMateria.length,
    endpoint: "/encuestaAMateria/create",
  });

  useEffect(() => {
    async function cargarDatosEncuesta() {
      if (!usuario) {
        setLoading(false);
        return;
      }
      try {
        const compañerosResponse: Alumno[] = await apiClient("/materias/alumnos", {
          method: "POST",
          body: JSON.stringify({
            codigoMateria,
            cuatrimestre,
            luAExcluir: usuario.lu,
          }),
        });
        setCompañeros(compañerosResponse);

        const profesoresResponse = await apiClient("/materias/profesores", {
          method: "POST",
          body: JSON.stringify({
            codigoMateria,
            cuatrimestre,
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
  }, [codigoMateria, usuario, cuatrimestre]);

  const handleEnviarTodo = async () => {
    setEnviando(true);
    setError(null);

    try {
      const luEncuestado = usuario!.lu;

      await encuestasCompañeros.enviarEncuestas(
        luEncuestado,
        codigoMateria,
        cuatrimestre
      );
      await encuestasProfesores.enviarEncuestas(
        luEncuestado,
        codigoMateria,
        cuatrimestre
      );
      await encuestaMateria.enviarEncuesta(
        luEncuestado,
        codigoMateria,
        cuatrimestre
      );

      alert("Encuesta completada exitosamente");
      router.push("/encuestas/completar");
    } catch (e: any) {
      setError(e.message || "Error al enviar las encuestas");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <LoadingScreen mensaje="Cargando compañeros..." />;
  if (error && !enviando) return <ErrorScreen error={error} />;

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Completar encuesta de {nombreMateria} {cuatrimestre}
      </h1>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Encuestas a compañeros ({compañeros.length})
          </h2>
          {compañeros.length > 0 && (
            <button
              onClick={encuestasCompañeros.completarAleatorio}
              className="px-4 py-2 bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Completar aleatorio
            </button>
          )}
        </div>
        {compañeros.length === 0 ? (
          <p className="text-gray-500">No hay compañeros para evaluar</p>
        ) : (
          compañeros.map((compañero) => {
            const respuesta = encuestasCompañeros.respuestas.get(compañero.lu);
            return (
              <EncuestaDesplegable
                key={compañero.lu}
                titulo={`${compañero.nombres || ""} ${
                  compañero.apellido || ""
                } (LU: ${compañero.lu})`.trim()}
                preguntas={preguntasCompañeros}
                respuestasIniciales={respuesta?.respuestas}
                comentarioInicial={respuesta?.comentario}
                onRespuestasChange={(respuestas, comentario) =>
                  encuestasCompañeros.actualizarRespuesta(
                    compañero.lu,
                    respuestas,
                    comentario
                  )
                }
              />
            );
          })
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Encuestas a profesores ({profesores.length})
          </h2>
          {profesores.length > 0 && (
            <button
              onClick={encuestasProfesores.completarAleatorio}
              className="px-4 py-2 bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Completar aleatorio
            </button>
          )}
        </div>
        {profesores.length === 0 ? (
          <p className="text-gray-500">No hay profesores para evaluar</p>
        ) : (
          profesores.map((profesor) => {
            const respuesta = encuestasProfesores.respuestas.get(profesor.lu);
            return (
              <EncuestaDesplegable
                key={profesor.lu}
                titulo={`${profesor.nombres || ""} ${
                  profesor.apellido || ""
                } (LU: ${profesor.lu})`.trim()}
                preguntas={preguntasProfesores}
                respuestasIniciales={respuesta?.respuestas}
                comentarioInicial={respuesta?.comentario}
                onRespuestasChange={(respuestas, comentario) =>
                  encuestasProfesores.actualizarRespuesta(
                    profesor.lu,
                    respuestas,
                    comentario
                  )
                }
              />
            );
          })
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Encuesta a la materia
          </h2>
          <button
            onClick={encuestaMateria.completarAleatorio}
            className="px-4 py-2 bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Completar aleatorio
          </button>
        </div>
        <EncuestaDesplegable
          titulo={`Encuesta sobre ${nombreMateria}`}
          preguntas={preguntasMateria}
          respuestasIniciales={encuestaMateria.respuesta?.respuestas}
          comentarioInicial={encuestaMateria.respuesta?.comentario}
          onRespuestasChange={(respuestas, comentario) =>
            encuestaMateria.actualizarRespuesta(respuestas, comentario)
          }
        />
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
