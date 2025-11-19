"use client";

import Encuesta from "@/components/encuesta";

export default function Pagina() {
  const preguntas = [
    "¿Qué tan satisfecho estás con la explicación?",
    "¿El material entregado te resultó útil?",
    "¿Recomendarías esta materia?"
  ];

  return (
    <div className="p-6">
      <Encuesta
        preguntas={preguntas}
        onChange={(res) => console.log("Respuestas:", res)}
      />
    </div>
  );
}
