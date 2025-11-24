"use client"

import React from "react"
import VerEncuestasPorMateriaYTipoClient from "./VerEncuestasPorMateriaYTipoClient";

type VerEncuestasPorMateriaYTipoProps = {
    params: Promise<{codigoMateria: string, cuatrimestre: string, tipoEncuesta: "materia" | "profesor" | "alumno"}> |
    {codigoMateria: string, cuatrimestre: string, tipoEncuesta: "materia" | "profesores" | "alumnos"};
}

export default function VerEncuestasPorMateriaYTipoPage({params}: VerEncuestasPorMateriaYTipoProps) {
    
    const {codigoMateria, cuatrimestre, tipoEncuesta} = React.use(params as any) as {codigoMateria: string, cuatrimestre: string, tipoEncuesta: "materia" | "profesores" | "alumnos"};
    
    return <VerEncuestasPorMateriaYTipoClient codigoMateria={codigoMateria} cuatrimestre={cuatrimestre} tipoEncuesta={tipoEncuesta}/>
}