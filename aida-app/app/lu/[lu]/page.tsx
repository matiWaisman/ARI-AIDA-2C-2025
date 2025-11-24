"use client";

import React from "react";
import CargarCertificado from "@/components/certificados/cargarCertificado";

type Props = {
  // Next puede pasar params como Promise en algunas versiones
  params: Promise<{ lu: string }> | { lu: string };
};

export default function CertificadoPage({ params }: Props) {
  // React.use unwrappea el Promise (Next recomienda esto)
  const resolved = React.use(params as any) as { lu: string };

  return (
    <CargarCertificado
      endpointPath="alumnos/lu"
      paramName="LU"
      paramValue={resolved.lu}
    />
  );
}
