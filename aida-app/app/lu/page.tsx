"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LU() {
  const [lu, setLu] = useState("");
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lu) {
      router.push(`/lu/${encodeURIComponent(lu)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>Obtener el certificado de título en trámite</div>
      <div>
        <label>
          Libreta Universitaria:{" "}
          <input 
            name="lu" 
            value={lu} 
            onChange={(e) => setLu(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Pedir Certificado</button>
    </form>
  );
}
