"use client";

import Formulario from "@/components/formulario";

export default function Fecha() {
  return (
    <Formulario
      title="Obtener el certificado de título en trámite"
      nombreLabel="Fecha del trámite"
      inputType="date"
      nombreInput="fecha"
      hrefCertificado="/fecha"
    />
  );
}
