"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/apiClient/apiClient";

export function useRegisterFeature() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [lu, setLu] = useState("");
  const [email, setEmail] = useState("");
  const [esAlumno, setEsAlumno] = useState(false);
  const [esProfesor, setEsProfesor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // TODO: Validar que te pasen un LU y no te pasen cualquier cosa 
    if (!esAlumno && !esProfesor) {
      setError("Debes seleccionar al menos un rol (Alumno o Profesor)");
      setLoading(false);
      return;
    }

    try {
      await apiClient("/register", {
        method: "POST",
        body: JSON.stringify({ 
          username, 
          password, 
          nombre,
          apellido, 
          lu,
          email, 
          esAlumno, 
          esProfesor 
        }),
      });

      router.push("/login");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return {
    username,
    password,
    nombre,
    apellido,
    lu,
    email,
    esAlumno,
    esProfesor,
    setUsername,
    setPassword,
    setNombre,
    setApellido,
    setLu,
    setEmail,
    setEsAlumno,
    setEsProfesor,
    handleRegister,
    loading,
    error,
  };
}
