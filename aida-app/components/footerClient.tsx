"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { apiClient } from "@/apiClient/apiClient";

export default function FooterClient() {
  const { loading, usuario, setUsuario } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient("/logout", { method: "POST" });
      setUsuario(null);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <footer className="mt-10 border-t border-gray-200 bg-white">
      <div className="container-page flex items-center justify-between text-xs text-gray-500 py-4">
        <span>© {new Date().getFullYear()} AIDA</span>

        {!loading && usuario && (
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </footer>
  );
}

