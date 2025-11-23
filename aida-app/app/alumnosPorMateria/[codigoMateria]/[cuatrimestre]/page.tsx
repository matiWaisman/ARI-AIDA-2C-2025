"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiClient";
import AlumnosDeMateriaClient from "./AlumnosDeMateriaClient";
import React from "react";

type AlumnoDeMateriaProps = {
    params: Promise<{codigoMateria: string, cuatrimestre: string}> | {codigoMateria: string, cuatrimestre: string};
}

export default function AlumnosDeMateriaPage({params}: AlumnoDeMateriaProps) {

    const {codigoMateria, cuatrimestre} = React.use(params as any) as {codigoMateria: string, cuatrimestre: string};
    
    const [alumnos, setAlumnos] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiClient(`/alumnosDeMateria/${codigoMateria}/${cuatrimestre}`)
        .then(setAlumnos)
        .catch((e) => setError(e.message));
    }, []);

    return <AlumnosDeMateriaClient alumnos={alumnos} codigoMateria={codigoMateria} cuatrimestre={cuatrimestre} error={error} />;
}
