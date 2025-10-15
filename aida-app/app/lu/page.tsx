"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LU() {
  const [lu, setLu] = useState("");
  const router = useRouter();
  
  const handleClick = () => {
    const url = "http://localhost:3000/app/lu/"
    const res = await fetch(url + lu);
    router.push(`/app/lu/${encodeURIComponent(lu)}`);
  };

  return (
    <>
      <div>Obtener el certificado de título en trámite</div>
      <div>
        <label>
          Libreta Universitaria:{" "}
          <input
            name="lu"
            value={lu}
            onChange={(e) => setLu(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleClick}>Pedir Certificado</button>
    </>
  );
}
