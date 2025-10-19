"use client";

import Menu from "@/components/menu";
import { menuFeature } from "@/features/menuFeature";

export default function MenuPage() {
  const { loading, usuario } = menuFeature();

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">AIDA</h1>
      <h2 className="text-sm text-gray-500 mb-6">
        Menú principal — Bienvenido {usuario?.username}
      </h2>
      <Menu />
    </div>
  );
}
