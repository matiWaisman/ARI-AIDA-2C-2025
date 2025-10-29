"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alumno } from "@/types/alumno";
import Certificado from "@/components/certificado";
import { apiClient } from "@/apiClient/apiClient";

type CargarCertificadoProps = {
  endpointPath: string;      // e.g. "/lu" or "/fecha"
  paramName: string;         // e.g. "LU" or "fecha"
  paramValue: string;        // value for the query param
};

export default function CargarCertificado({ endpointPath, paramName, paramValue }: CargarCertificadoProps) {
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${endpointPath}?${encodeURIComponent(paramName)}=${encodeURIComponent(paramValue)}`;
        const alumnoData: Alumno = await apiClient(url);
        setAlumno(alumnoData);
      } catch (err) {
        console.error("Error fetching alumno:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (paramValue) {
      fetchAlumno();
    }
  }, [endpointPath, paramName, paramValue]);

  if (loading) return <p>Cargando certificado...</p>;

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => router.back()}>
          Volver al formulario
        </button>
      </div>
    );
  }

  if (!alumno) return <p>No se encontró el alumno</p>;

  return (
    <Certificado
      lu={alumno.lu}
      nombre={`${alumno.nombres} ${alumno.apellido}`}
      titulo={alumno.titulo}
      fecha={alumno.egreso}
    />
  );
}
