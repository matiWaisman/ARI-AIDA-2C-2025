"use client";

import CargarCertificado from "@/components/cargarCertificado";

type Props = {
  params: { lu: string };
};

export default function CertificadoPage({ params }: Props) {
  return (
    <CargarCertificado
      endpointPath="/lu"
      paramName="LU"
      paramValue={params.lu}
    />
  );
}
