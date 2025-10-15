"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alumno } from "@/types/alumno";
import Certificado from "@/components/certificado";

type Props = {
  params: { lu: string };
};

export default function CertificadoPage({ params }: Props) {
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(params.lu);
        const url = `http://localhost:3000/app/lu?LU=${encodeURIComponent(params.lu)}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const alumnoData: Alumno = await res.json();
        console.log(alumnoData);
        setAlumno(alumnoData);
      } catch (err) {
        console.error("Error fetching alumno:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (params.lu) {
      console.log(params.lu);
      fetchAlumno();
    }
  }, [params.lu]);

  if (loading) return <p>Cargando certificado...</p>;
  
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => router.push("/lu")}>
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
