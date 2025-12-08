"use client";

import React from "react";
import CargarCertificado from "@/components/certificados/cargarCertificado";

type Props = {
  params: Promise<{ fecha: string }>;
};

export default function CertificadoPage({ params }: Props) {
  const resolved = React.use(params);
return (
  <CargarCertificado
    endpointPath={`alumnos/getBy/titulo_en_tramite/${resolved.fecha}`}
    paramName=""
    paramValue=""
  />
);

}
