"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Formulario from "@/components/formulario";

export default function Archivo() {
  const router = useRouter();

  const handleSubmit = (file: File | null) => {
    if (file) {
      router.push(`/app/archivo/${encodeURIComponent(file.name)}`);
    }
  };

  return (
    <Formulario
      title="Subir archivo CSV"
      nombreLabel="Subí tu archivo"
      inputType="file"
      nombreInput="archivo"
      hrefCertificado="/app/archivo"
      onFileSubmit={handleSubmit} 
    />
  );
}
