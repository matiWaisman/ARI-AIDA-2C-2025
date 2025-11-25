"use client";

import React from "react";
import CargarCertificado from "@/components/certificados/cargarCertificado";

type Props = {
  params: Promise<{ fecha: string }>;
};

export default function CertificadoPage({ params }: Props) {
  const { fecha } = React.use(params);

  return (
    <CargarCertificado
      endpointPath="/alumnos/fecha"
      paramName="fecha"
      paramValue={fecha}
    />
  );
}
