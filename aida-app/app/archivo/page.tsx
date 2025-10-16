"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Archivo() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("archivo", file);
      try {
        const res = await fetch("http://localhost:3000/app/cargarCSV", {
          method: "POST",
          body: formData,
        });

        if (res.status === 200) {
          setStatus("success");
          setMessage("Datos cargados correctamente");
        } else {
          let body: any = null;
          try {
            body = await res.json();
          } catch {}
          const errorMsg = body?.message || body?.error || res.statusText || "Error desconocido";
          setStatus("error");
          setMessage(`Código ${res.status}: ${errorMsg}`);
        }
      } catch (err) {
        setStatus("error");
        setMessage("Error de red o del servidor");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>Subir archivo CSV</div>
      <div>
        <label>
          Subí tu archivo:{" "}
          <input
            type="file"
            name="archivo"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required
          />
        </label>
      </div>
      <button type="submit">Subir archivo</button>
      {status && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px 12px",
            color: status === "success" ? "#064e3b" : "#7f1d1d",
            backgroundColor: status === "success" ? "#d1fae5" : "#fee2e2",
            border: "1px solid",
            borderColor: status === "success" ? "#10b981" : "#ef4444",
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}
    </form>
  );
}
