"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormularioProps = {
  title: string;
  nombreLabel: string;
  inputType: string;
  nombreInput: string;
  hrefCertificado: string;
  onFileSubmit?: (file: File | null) => void; 
};

export default function Formulario({ title, nombreLabel, inputType, nombreInput, hrefCertificado, onFileSubmit }: FormularioProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputType === "file") {
      const input = (e.currentTarget as HTMLFormElement).elements.namedItem(nombreInput) as HTMLInputElement;
      const file = input.files ? input.files[0] : null;
      if (file && onFileSubmit) {
        onFileSubmit(file);
      }
    } else {
      if (value) {
        console.log("Nos movemos");
        router.push(`${hrefCertificado}/${encodeURIComponent(value)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>{title}</div>
      <div>
        <label>
          {nombreLabel}:{" "}
          <input
            type={inputType}
            name={nombreInput}
            value={inputType === "file" ? undefined : value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">{inputType === "file" ? "Subir archivo" : "Pedir Certificado"}</button>
    </form>
  );
}
