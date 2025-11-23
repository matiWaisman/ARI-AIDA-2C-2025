"use client"

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loadingScreen";
import ErrorScreen from "@/components/errorScreen";
import { apiClient } from "@/apiClient/apiClient";
import Menu from "@/components/menu";

export default function VerEncuestasClient() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [menuMaterias, setMenuMaterias] = useState<
        Map<string, [string, string]>
    >(new Map());

    useEffect(() => {
        async function cargarDatos() {
        try {
            const materias = await apiClient(
            "/materias",
            { method: "GET" }
            );

            const materiasMap = new Map();
            
            for (const m of materias) {
                
                const titulo = `Ver encuesta de ${m.nombreMateria} - ${m.cuatrimestre}`;
                    
                const ruta = `/encuestas/visualizar/${encodeURIComponent(m.codigoMateria)}/${encodeURIComponent(m.cuatrimestre)}`;
                materiasMap.set(titulo, [ruta, titulo]);
            }

            setMenuMaterias(materiasMap);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
        }

        cargarDatos();
    }, []);

    if (loading) return <LoadingScreen mensaje="Cargando encuestas..." />;
    if (error) return <ErrorScreen error={error} />;
    
    const hayMaterias = menuMaterias.size > 0;

    return(
        <>
        {hayMaterias && (
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Ver encuestas
                </h1>
                <Menu options={menuMaterias} />
            </div>
        )}
        </>
    )
}

