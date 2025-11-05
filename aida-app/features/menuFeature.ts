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
        const data = await apiClient("/session");
        setUsuario(data.usuario || null);
        
        // Si el login es requerido y no hay usuario, redirigir al login
        if (data.requireLogin && !data.usuario) {
          router.push("/login");
        }
      } catch (err: any) {
        // Si hay error 401 y requireLogin está activo, redirigir al login
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
        } else {
          // Si hay error pero no es 401, simplemente no hay usuario logueado
          setUsuario(null);
        }
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  return { loading, usuario };
}
