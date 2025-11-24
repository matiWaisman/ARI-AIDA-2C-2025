"use client";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

export default function HeaderClient() {
  const { loading, usuario } = useUser();

  const getRoles = () => {
    if (!usuario) return "";
    const roles: string[] = [];
    if (usuario.esAlumno === true) roles.push("Alumno");
    if (usuario.esProfesor === true) roles.push("Profesor");
    return roles.length > 0 ? roles.join(" / ") : "";
  };

  const rolesText = getRoles();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container-page flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          <Link href="/">AIDA</Link>
        </h1>

        <div className="text-sm text-gray-600 text-right">
          {loading && "Cargando..."}
          {!loading && usuario && (
            <div className="flex flex-col">
              <span>
                Bienvenido,{" "}
                <span className="font-semibold text-gray-900">
                  {usuario.username}
                </span>
              </span>
              {rolesText && (
                <span className="text-xs text-gray-500">{rolesText}</span>
              )}
            </div>
          )}
          {!loading && !usuario && "Invitado"}
        </div>
      </div>
    </header>
  );
}
