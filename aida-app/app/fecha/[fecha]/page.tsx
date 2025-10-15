"use client";

import CargarCertificado from "@/components/cargarCertificado";

type Props = {
  params: { fecha: string };
};

export default function CertificadoPage({ params }: Props) {
  console.log(params.fecha)
  return (
    <CargarCertificado
      apiUrl="http://localhost:3000/app/Fecha"
      paramName="fecha"
      paramValue={params.fecha}
    />
  );
}
