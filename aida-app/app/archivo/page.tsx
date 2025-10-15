"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Fecha() {
  const [archivo, setArchivo] = useState("");
  const router = useRouter();

  const handleClick = () => {
    router.push(`/app/archivo/${encodeURIComponent(archivo)}`);
  };

  return (
    <>
      <div>Subir archivo CSV</div>
      <div>
        <label>
          Subi tu archivo:{" "}
          <input
            type="file"
            name="archivo"
            value={archivo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setArchivo(e.target.value)
            }
          />
        </label>
      </div>
      <button onClick={handleClick}>Subir archivo</button>
    </>
  );
}
