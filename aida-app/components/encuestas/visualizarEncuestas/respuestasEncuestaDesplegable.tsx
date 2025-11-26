"use client";

import { useState } from "react";
import {
  preguntasCompañeros,
  preguntasProfesores,
  preguntasMateria,
} from "@/app/encuestas/preguntas";

export default function RespuestaEncuestaDesplegable({
  encuesta,
  tipoEncuesta,
}: {
  encuesta: {
    nombreEncuestado: string;
    resultados: number[];
    comentarios: string[];
  };
  tipoEncuesta: "materia" | "profesor" | "alumno";
}) {
  const [abierto, setAbierto] = useState(false);
  const format = (n: number) => Number(n.toFixed(2)).toString();

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white mb-4 overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-200 group"
      >
        <span className="font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
          {encuesta.nombreEncuestado}
        </span>

        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-sky-100 transition-all duration-200">
          <svg
            className={`w-5 h-5 text-gray-600 group-hover:text-sky-600 transition-transform duration-300 ${
              abierto ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          abierto ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 border-t border-gray-200 space-y-6">
          {encuesta.resultados.map((valor, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <span className="text-gray-800 font-medium flex-1 min-w-0">
                  {tipoEncuesta === "materia" && preguntasMateria[index]}
                  {tipoEncuesta === "alumno" && preguntasCompañeros[index]}
                  {tipoEncuesta === "profesor" && preguntasProfesores[index]}
                </span>

                <span className="text-sky-600 font-bold text-lg flex-shrink-0 whitespace-nowrap">
                  {valor != null ? format(valor) : "-"}{" "}
                  <span className="text-gray-500 text-base">/5</span>
                </span>
              </div>
            </div>
          ))}

          {/* Comentarios al final */}
          {encuesta.comentarios.length > 0 && (
            <div className="mt-6">
              <h3 className="text-gray-800 font-semibold mb-2">Comentarios</h3>

              <div className="space-y-3">
                {encuesta.comentarios.map((c, i) =>
                  c.trim() !== "" ? (
                    <div
                      key={i}
                      className="p-3 bg-white border border-gray-300 rounded-md text-gray-700 whitespace-pre-line"
                    >
                      {c}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
