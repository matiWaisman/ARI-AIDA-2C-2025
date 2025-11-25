"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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

  const checkSession = useCallback(async () => {
    try {
      const data = await apiClient("/session");
      setUsuario(data.usuario || null);

      if (data.requireLogin && !data.usuario && pathname !== "/register") {
        router.push("/login");
      }
    } catch (err: any) {
      if (
        err instanceof Error &&
        err.message.includes("401") &&
        pathname !== "/register"
      ) {
        setUsuario((currentUsuario) => {
          if (!currentUsuario) {
            router.push("/login");
          }
          return currentUsuario;
        });
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
