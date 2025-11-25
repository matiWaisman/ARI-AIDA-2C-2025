"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/apiClient/apiClient";
import { Usuario } from "@/types/usuario";

export function menuFeature() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await apiClient("/session");
        setUsuario(data.usuario || null);
        
        if (data.requireLogin && !data.usuario) {
          router.push("/login");
        }
      } catch (err: any) {
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
        } else {
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
