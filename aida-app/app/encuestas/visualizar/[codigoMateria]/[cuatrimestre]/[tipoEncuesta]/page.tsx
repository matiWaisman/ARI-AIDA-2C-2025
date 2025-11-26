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

  return (
    <VerEncuestasPorMateriaYTipoClient
      codigoMateria={codigoMateria}
      cuatrimestre={cuatrimestre}
      tipoEncuesta={tipoEncuesta}
      nombreMateria={nombreMateria}
    />
  );
}
