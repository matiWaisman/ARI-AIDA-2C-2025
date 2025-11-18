"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiClient";
import AlumnosClient from "./AlumnosClient";

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient("/alumnos/all", { method: "GET" })
      .then(setAlumnos)
      .catch((e) => setError(e.message));
  }, []);

  return <AlumnosClient alumnos={alumnos} error={error} />;
}
