"use client";

import Formulario from "@/components/formulario";

export default function LU() {
  return (
    <Formulario
      title="Obtener el certificado de título en trámite"
      nombreLabel="Libreta Universitaria"
      inputType="text"
      nombreInput="lu"
      hrefCertificado="/lu"
    />
  );
}
