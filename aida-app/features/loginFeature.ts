"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/apiClient/apiClient";
import { useUser } from "@/contexts/UserContext";

export function LoginFeature() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUsuario, checkSession } = useUser();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.usuario) {
        setUsuario(response.usuario);
        router.push("/");
      } else {
        setError("No se recibió información del usuario");
      }
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
    setUsername,
    setPassword,
    handleLogin,
    error,
    loading,
  };
}
