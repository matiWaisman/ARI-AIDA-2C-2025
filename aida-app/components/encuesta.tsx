"use client";

import { useState } from "react";
import LabelEncuesta from "./labelEncuesta";

type EncuestaProps = {
  preguntas: string[];
  onChange?: (respuestas: Record<number, number>) => void;
  onSubmit?: (respuestas: Record<number, number>) => void;
};

export default function Encuesta({ preguntas, onChange, onSubmit }: EncuestaProps) {
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});

  const actualizarRespuesta = (index: number, valor: number) => {
    const nuevas = { ...respuestas, [index]: valor };
    setRespuestas(nuevas);
    onChange?.(nuevas);
  };

  const handleEnviar = () => {
    onSubmit?.(respuestas);
    console.log("Respuestas enviadas:", respuestas);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {preguntas.map((texto, index) => (
        <LabelEncuesta
          key={index}
          texto={texto}
          onChange={(valor) => actualizarRespuesta(index, valor)}
        />
      ))}

      <div className="flex justify-center">
        <button
          onClick={handleEnviar}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
