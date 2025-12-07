"use client";

import React from "react";
import CargarCertificado from "@/components/certificados/cargarCertificado";

type Props = {
  params: Promise<{ lu: string }>;
};

export default function CertificadoPage({ params }: Props) {
  const resolved = React.use(params);

  return (
<CargarCertificado
  endpointPath="alumnos/findOne"
  paramName="lu"
  paramValue={resolved.lu}
/>

  );
}
