"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormularioProps = {
  title: string;
  nombreLabel: string;
  inputType: string;
  nombreInput: string;
  hrefCertificado: string;
};

export default function Formulario({ title, nombreLabel, inputType, nombreInput, hrefCertificado }: FormularioProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value) {
      router.push(`${hrefCertificado}/${encodeURIComponent(value)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="heading">{title}</h2>
      <div>
        <label className="label" htmlFor={nombreInput}>
          {nombreLabel}
        </label>
        <input
          id={nombreInput}
          className="input"
          type={inputType}
          name={nombreInput}
          value={inputType === "file" ? undefined : value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn-primary">Pedir Certificado</button>
    </form>
  );
}
