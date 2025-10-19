"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/apiClient/apiClient";

export function menuFeature() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await apiClient("/app/session");
        setUsuario(data.usuario);
      } catch (err) {
        // Si no está logueado (401), redirige al login
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  return { loading, usuario };
}
