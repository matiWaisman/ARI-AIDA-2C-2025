"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { apiClient } from "@/apiClient/apiClient";

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
        const res = await apiClient("/cargarCSV", {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="heading">Subir archivo CSV</h2>
      <div>
        <label className="label" htmlFor="archivo">Subí tu archivo</label>
        <input
          id="archivo"
          className="input"
          type="file"
          name="archivo"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          required
        />
      </div>
      <button type="submit" className="btn-primary">Subir archivo</button>
      {status && (
        <div className={status === "success" ? "alert-success" : "alert-error"}>
          {message}
        </div>
      )}
    </form>
  );
}
