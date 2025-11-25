"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import VerEncuestasPorMateriaYTipoClient from "./VerEncuestasPorMateriaYTipoClient";

type VerEncuestasPorMateriaYTipoProps = {
  params: Promise<{
    codigoMateria: string;
    cuatrimestre: string;
    tipoEncuesta: "materia" | "profesor" | "alumno";
  }>;
};

export default function VerEncuestasPorMateriaYTipoPage({
  params,
}: VerEncuestasPorMateriaYTipoProps) {
  const { codigoMateria, cuatrimestre, tipoEncuesta } = React.use(params);
  const searchParams = useSearchParams();
  const nombreMateria = searchParams.get("nombreMateria") || "";

  const tipoEncuestaMapeado: "materia" | "profesores" | "alumnos" =
    tipoEncuesta === "profesor"
      ? "profesores"
      : tipoEncuesta === "alumno"
        ? "alumnos"
        : "materia";

  return (
    <VerEncuestasPorMateriaYTipoClient
      codigoMateria={codigoMateria}
      cuatrimestre={cuatrimestre}
      tipoEncuesta={tipoEncuestaMapeado}
      nombreMateria={nombreMateria}
    />
  );
}
