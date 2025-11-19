"use client";

import Menu from "@/components/menu";
import LoadingScreen from "@/components/loadingScreen";
import { useUser } from "@/contexts/UserContext";

export default function MenuPage() {
  const { loading, usuario } = useUser();

  if (loading) return <LoadingScreen mensaje="Cargando menú..." />;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">AIDA</h1>
      <h2 className="text-sm text-gray-500 mb-6">
        Menú principal — Bienvenido {usuario?.username || "Invitado"}
      </h2>
      <Menu />
    </div>
  );
}
