"use client";

import CargarCertificado from "@/components/cargarCertificado";

type Props = {
  params: { fecha: string };
};

export default function CertificadoPage({ params }: Props) {
  console.log(params.fecha)
  return (
    <CargarCertificado
      endpointPath="/fecha"
      paramName="fecha"
      paramValue={params.fecha}
    />
  );
}
