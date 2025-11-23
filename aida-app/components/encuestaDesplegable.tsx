"use client";

import { useState, useEffect } from "react";
import LabelEncuesta from "./labelEncuesta";

type EncuestaDesplegableProps = {
  titulo: string;
  preguntas: string[];
  onRespuestasChange?: (respuestas: number[], comentario: string) => void;
  respuestasIniciales?: number[];
  comentarioInicial?: string;
};

export default function EncuestaDesplegable({
  titulo,
  preguntas,
  onRespuestasChange,
  respuestasIniciales,
  comentarioInicial = "",
}: EncuestaDesplegableProps) {
  const [abierto, setAbierto] = useState(false);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [comentario, setComentario] = useState(comentarioInicial);

  useEffect(() => {
    if (respuestasIniciales) {
      const nuevasRespuestas: Record<number, number> = {};
      respuestasIniciales.forEach((valor, index) => {
        if (valor > 0) {
          nuevasRespuestas[index] = valor;
        }
      });
      setRespuestas(nuevasRespuestas);
      const respuestasActuales = Object.values(nuevasRespuestas);
      if (respuestasActuales.length > 0 && respuestasActuales.some(r => r > 0)) {
        onRespuestasChange?.(respuestasIniciales, comentario);
      }
    }
  }, [respuestasIniciales]);

  useEffect(() => {
    if (comentarioInicial !== undefined) {
      setComentario(comentarioInicial);
    }
  }, [comentarioInicial]);

  const actualizarRespuesta = (index: number, valor: number) => {
    const nuevas = { ...respuestas, [index]: valor };
    setRespuestas(nuevas);
    
    const respuestasArray = Array.from({ length: preguntas.length }, (_, i) => nuevas[i] || 0);
    onRespuestasChange?.(respuestasArray, comentario);
  };

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nuevoComentario = e.target.value;
    setComentario(nuevoComentario);
    
    const respuestasArray = Array.from({ length: preguntas.length }, (_, i) => respuestas[i] || 0);
    onRespuestasChange?.(respuestasArray, nuevoComentario);
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white mb-4 overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-200 group"
      >
        <span className="font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
          {titulo}
        </span>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-sky-100 transition-all duration-200">
          <svg
            className={`w-5 h-5 text-gray-600 group-hover:text-sky-600 transition-transform duration-300 ${
              abierto ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
        <div className="px-6 py-4 border-t border-gray-200 space-y-4">
          {preguntas.map((pregunta, index) => (
            <LabelEncuesta
              key={index}
              texto={pregunta}
              valorInicial={respuestas[index]}
              onChange={(valor) => actualizarRespuesta(index, valor)}
            />
          ))}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios
            </label>
            <textarea
              value={comentario}
              onChange={handleComentarioChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none resize-none transition-all"
              placeholder="Escribe tus comentarios aquí..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

