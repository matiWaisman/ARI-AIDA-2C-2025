"use client";

import CargarCertificado from "@/components/certificados/cargarCertificado";

type Props = {
  params: { fecha: string };
};

export default function CertificadoPage({ params }: Props) {
  return (
    <CargarCertificado
      endpointPath="/alumnos/fecha"
      paramName="fecha"
      paramValue={params.fecha}
    />
  );
}
