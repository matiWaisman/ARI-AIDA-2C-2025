"use client";

import Menu from "@/components/menu";
import LoadingScreen from "@/components/loadingScreen";
import { useUser } from "@/contexts/UserContext";

export default function MenuPage() {
  const { loading, usuario } = useUser();

  const menuOptions: Map<string, [string, string]> = new Map([
    ["Completar encuestas", ["/completarEncuestas", "Completar encuestas"]],
    ["Ver resultados encuestas", ["/verEncuestas", "Ver resultados de encuestas"]],
  ]);

  if (loading) return <LoadingScreen mensaje="Cargando menú..." />;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Encuestas</h1>
      <Menu options={menuOptions} />
    </div>
  );
}
