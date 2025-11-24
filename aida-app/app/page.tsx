"use client";

import Menu from "@/components/menu";
import LoadingScreen from "@/components/loadingScreen";
import { useUser } from "@/contexts/UserContext";

export default function MenuPage() {
  const { loading, usuario } = useUser();

  const esProfesor = usuario?.esProfesor === true;

  const menuOptions: Map<string, [string, string]> = new Map();

  if (esProfesor) {
    menuOptions.set("alumnos", [
      "/alumnos",
      "Ver, modificar, eliminar y agregar alumnos",
    ]);
    menuOptions.set("lu", ["/lu", "Imprimir certificado por LU"]);
    menuOptions.set("fecha", [
      "/fecha",
      "Imprimir certificado por fecha de trámite",
    ]);
    menuOptions.set("archivo", [
      "/archivo",
      "Subir CSV con novedades de alumnos",
    ]);
  }

  menuOptions.set("inscripciones", ["/inscripciones", "Inscripciones"]);
  menuOptions.set("encuestas", ["/encuestas", "Encuestas"]);
  menuOptions.set("materias", ["/materias", "Ver mis materias"]);

  if (loading) return <LoadingScreen mensaje="Cargando menú..." />;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">AIDA</h1>
      <h2 className="text-sm text-gray-500 mb-6">
        Menú principal — Bienvenido {usuario?.username || "Invitado"}
      </h2>
      <Menu options={menuOptions} />
    </div>
  );
}
