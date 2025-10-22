"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/apiClient/apiClient";

export function useRegisterFeature() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient("/register", {
        method: "POST",
        body: JSON.stringify({ username, password, nombre, email }),
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
    email,
    setUsername,
    setPassword,
    setNombre,
    setEmail,
    handleRegister,
    loading,
    error,
  };
}
