"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Fecha() {
  const [fecha, setFecha] = useState("");
  const router = useRouter();

  const handleClick = () => {
    router.push(`/app/fecha/${encodeURIComponent(fecha)}`);
  };

  return (
    <>
      <div>Obtener el certificado de título en trámite</div>
      <div>
        <label>
          Fecha del trámite:{" "}
          <input
            type="date"
            name="fecha"
            value={fecha}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFecha(e.target.value)
            }
          />
        </label>
      </div>
      <button onClick={handleClick}>Pedir Certificado</button>
    </>
  );
}
