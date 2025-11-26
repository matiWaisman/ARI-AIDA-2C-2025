"use client";

import VerEncuestasPorMateriaClient from "./VerEncuestasPorMateriaClient";
import React from "react";

type VerEncuestasPorMateriaProps = {
  params: Promise<{ codigoMateria: string; cuatrimestre: string }>;
};

export default function VerEncuestasPorMateriaPage({
  params,
}: VerEncuestasPorMateriaProps) {
  const { codigoMateria, cuatrimestre } = React.use(params);

  return (
    <VerEncuestasPorMateriaClient
      codigoMateria={codigoMateria}
      cuatrimestre={cuatrimestre}
    />
  );
}
