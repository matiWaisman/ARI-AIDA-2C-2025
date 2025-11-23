"use client";

import Menu from "@/components/menu";
import LoadingScreen from "@/components/loadingScreen";
import { useUser } from "@/contexts/UserContext";


export default function VerEncuestasPorMateriaClient({
    codigoMateria,
    cuatrimestre
}: {
    codigoMateria: string;
    cuatrimestre: string;
}) {

    const { loading, usuario } = useUser();
    

    const menuOptions: Map<string, [string, string]> = new Map([
        ["Encuestas de la Materia", [`/encuestas/visualizar/${codigoMateria}/${cuatrimestre}/materia`, "Encuestas de la Materia"]],
        ["Encuestas de los Profesores", [`/encuestas/visualizar/${codigoMateria}/${cuatrimestre}/profesores`, "Encuestas de los Profesores"]],
        ["Encuestas de los Alumnos", [`/encuestas/visualizar/${codigoMateria}/${cuatrimestre}/alumnos`, "Encuestas de los Alumnos"]],
    ]);

    if (loading) return <LoadingScreen mensaje="Cargando menú..." />;

    return (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Tipo de Encuesta</h1>
          <Menu options={menuOptions} />
        </div>
    );
}