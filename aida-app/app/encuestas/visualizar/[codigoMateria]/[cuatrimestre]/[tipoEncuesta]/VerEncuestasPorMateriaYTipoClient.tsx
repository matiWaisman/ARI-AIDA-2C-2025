"use client"

import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiClient";
import RespuestaEncuestaDesplegable from "@/components/RespuestasEncuestaDesplegable";

export default function VerEncuestasPorMateriaYTipoClient({
    codigoMateria,
    cuatrimestre,
    tipoEncuesta
}: {
    codigoMateria: string;
    cuatrimestre: string;
    tipoEncuesta: "materia" | "profesores" | "alumnos";
}) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [encuestas, setEncuestas] = useState<any[]>([])


    useEffect(() => {
        async function cargarRespuestasEncuesta() {
            try{
                const resultadosEcuestas = await apiClient(`/encuestas/get/${tipoEncuesta}/${codigoMateria}/${cuatrimestre}`, 
                    {method: "GET"}
                );
                setEncuestas(resultadosEcuestas);
            } catch (e: any) {
                setError(e.message || "Error al cargar compañeros o profesores");
            } finally {
                setLoading(false);
            }
        
        }

        cargarRespuestasEncuesta();

    }, [codigoMateria, cuatrimestre, tipoEncuesta]);
    
    return (
        <>
            {loading && <p>Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {encuestas.length === 0 && !loading && (
            <p className="text-gray-500">No hay encuestas completas</p>
            )}

            {encuestas.map((encuesta, index) => (
            <RespuestaEncuestaDesplegable key={index} encuesta={encuesta} tipoEncuesta={tipoEncuesta} />
            ))}
        </>
    );

}