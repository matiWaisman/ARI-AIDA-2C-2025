"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/apiClient/apiClient";

export type RespuestaEncuesta = {
  respuestas: number[];
  comentario: string;
};

export type RespuestaEncuestaConLu = RespuestaEncuesta & {
  lu: string;
};

type UseEncuestasPersonasOptions = {
  evaluados: Array<{ lu: string; nombres?: string; apellido?: string }>;
  numPreguntas: number;
  tipoEncuesta: "alumno" | "profesor";
};

type UseEncuestaMateriaOptions = {
  numPreguntas: number;
};

function mapearRespuestas(respuestas: number[]) {
  const obj: Record<string, number> = {};
  respuestas.forEach((valor, i) => {
    obj[`respuesta${i + 1}`] = valor;
  });
  return obj;
}

export function useEncuestasPersonas({
  evaluados,
  numPreguntas,
  tipoEncuesta,
}: UseEncuestasPersonasOptions) {
  const [respuestas, setRespuestas] = useState<
    Map<string, RespuestaEncuestaConLu>
  >(new Map());

  const actualizarRespuesta = useCallback(
    (lu: string, respuestasArray: number[], comentario: string) => {
      setRespuestas((prev) => {
        const nuevo = new Map(prev);
        nuevo.set(lu, { lu, respuestas: respuestasArray, comentario });
        return nuevo;
      });
    },
    []
  );

  const generarPuntajeAleatorio = () => Math.floor(Math.random() * 5) + 1;

  const completarAleatorio = useCallback(() => {
    const nuevasRespuestas = new Map<string, RespuestaEncuestaConLu>();
    evaluados.forEach((evaluado) => {
      const respuestasArray = Array.from({ length: numPreguntas }, () =>
        generarPuntajeAleatorio()
      );
      nuevasRespuestas.set(evaluado.lu, {
        lu: evaluado.lu,
        respuestas: respuestasArray,
        comentario: "",
      });
    });
    setRespuestas(nuevasRespuestas);
  }, [evaluados, numPreguntas]);

  const enviarEncuestas = useCallback(
    async (
      luEncuestado: string,
      codigoMateria: string,
      cuatrimestre: string
    ): Promise<void> => {
      const endpoint =
        tipoEncuesta === "alumno"
          ? "/encuestaAAlumno/create"
          : "/encuestaAProfesor/create";

      for (const [lu, respuesta] of respuestas.entries()) {
        if (respuesta.respuestas.some((r) => r > 0)) {
          const respuestasSeparadas = mapearRespuestas(respuesta.respuestas);

          await apiClient(endpoint, {
            method: "POST",
            body: JSON.stringify({
              luEncuestado,
              luEvaluado: lu,
              codigoMateria,
              cuatrimestre,
              comentario: respuesta.comentario || undefined,
              ...respuestasSeparadas,
            }),
          });
        }
      }
    },
    [respuestas, tipoEncuesta]
  );

  return {
    respuestas,
    actualizarRespuesta,
    completarAleatorio,
    enviarEncuestas,
  };
}

export function useEncuestaMateria({
  numPreguntas,
}: UseEncuestaMateriaOptions) {
  const [respuesta, setRespuesta] = useState<RespuestaEncuesta | null>(null);

  const actualizarRespuesta = useCallback(
    (respuestasArray: number[], comentario: string) => {
      setRespuesta({ respuestas: respuestasArray, comentario });
    },
    []
  );

  const generarPuntajeAleatorio = () => Math.floor(Math.random() * 5) + 1;

  const completarAleatorio = useCallback(() => {
    const respuestasArray = Array.from({ length: numPreguntas }, () =>
      generarPuntajeAleatorio()
    );
    setRespuesta({ respuestas: respuestasArray, comentario: "" });
  }, [numPreguntas]);

  const enviarEncuesta = useCallback(
    async (
      luEncuestado: string,
      codigoMateria: string,
      cuatrimestre: string
    ): Promise<void> => {
      if (respuesta && respuesta.respuestas.some((r) => r > 0)) {
        const respuestasSeparadas = mapearRespuestas(respuesta.respuestas);

        await apiClient("/encuestaAMateria/create", {
          method: "POST",
          body: JSON.stringify({
            luEncuestado,
            codigoMateria,
            cuatrimestre,
            comentario: respuesta.comentario,
            ...respuestasSeparadas,
          }),
        });
      }
    },
    [respuesta]
  );

  return {
    respuesta,
    actualizarRespuesta,
    completarAleatorio,
    enviarEncuesta,
  };
}
