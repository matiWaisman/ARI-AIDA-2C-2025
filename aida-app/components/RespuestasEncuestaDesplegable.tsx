"use client";

import { useState } from "react";

export default function RespuestaEncuestaDesplegable({
  encuesta,
}: {
  encuesta: {
    nombreEncuestado: string;
    resultados: number[];
    comentarios: string[];
  };
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white mb-4 overflow-hidden transition-shadow hover:shadow-md">
      
      {/* HEADER */}
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

      {/* CONTENIDO */}
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
              {/* Título de la pregunta */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-800 font-medium">
                  Pregunta {index + 1}
                </span>

                <span className="text-sky-600 font-bold text-lg">
                  {valor ?? "-"}
                </span>
              </div>

              {/* Comentario correspondiente */}
              {encuesta.comentarios[index] &&
                encuesta.comentarios[index].trim() !== "" && (
                  <div className="mt-2 p-3 bg-white border border-gray-300 rounded-md text-gray-700 whitespace-pre-line">
                    {encuesta.comentarios[index]}
                  </div>
                )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
