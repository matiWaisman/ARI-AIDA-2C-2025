"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiClient";
import AlumnosClient from "./AlumnosClient";
import { useUser } from "@/contexts/UserContext";
import ErrorScreen from "@/components/errorScreen";
import { Alumno } from "@/types/alumno";

export default function AlumnosPage() {
  const { usuario, loading } = useUser();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!usuario || usuario.esProfesor !== true) {
      setError("No tenés permisos para acceder a esta página.");
      return;
    }

    apiClient("/alumnos/all", { method: "GET" })
      .then(setAlumnos)
      .catch((e) => setError(e.message));
  }, [loading, usuario]);

  if (loading) return null;
  if (!usuario || usuario.esProfesor !== true) {
    return (
      <ErrorScreen error="No tenés permisos para acceder a esta página." />
    );
  }

  return <AlumnosClient alumnos={alumnos} error={error} />;
}
