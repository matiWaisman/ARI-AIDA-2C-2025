"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/apiClient/apiClient";
import { Usuario } from "@/types/usuario";

interface UserContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  loading: boolean;
  checkSession: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const usuarioRef = useRef<Usuario | null>(null);

  useEffect(() => {
    usuarioRef.current = usuario;
  }, [usuario]);

  const checkSession = useCallback(async () => {
    const usuarioAnterior = usuarioRef.current;

    try {
      const data = await apiClient("/session");
      setUsuario(data.usuario || null);

      if (data.requireLogin && !data.usuario && pathname !== "/register") {
        router.push("/login");
      }
    } catch (err: any) {
      const statusCode =
        err?.status ||
        (err instanceof Error && err.message.includes("401") ? 401 : null);
      if (statusCode === 401 && pathname !== "/register") {
        if (!usuarioAnterior) {
          router.push("/login");
          setUsuario(null);
        }
      } else {
        if (!usuarioAnterior) {
          setUsuario(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <UserContext.Provider
      value={{ usuario, setUsuario, loading, checkSession }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
