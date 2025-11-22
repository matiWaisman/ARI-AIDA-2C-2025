"use client"

import { MateriaApi } from "./tablaInscripciones"
import { FilaMateria } from "./filaMateria"

interface TablaMateriaProps {
    Materias: MateriaApi[];
    onEnter?: (codigoMateria: string, cuatrimestre: string) => void;
    tipo: "alumno" | "profesor";
    nombreCampoAux: string
}

export function TablaMaterias({
    Materias,
    onEnter,
    tipo,
    nombreCampoAux
}: TablaMateriaProps) {

    return (
        <div className="w-full space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-sm font-semibold text-muted-foreground mb-4">
            <div className="col-span-4">Materia</div>
            <div className="col-span-2">Cuatrimestre</div>
            <div className="col-span-4">Profesor</div>
            <div className="col-span-2">{nombreCampoAux}</div>
          </div>
    
          {Materias.map((m) => {
            const profesor = `${m.nombres} ${m.apellido}`;

            console.log(m.nombremateria);
            return (
              <FilaMateria
                key={`${tipo}-${m.codigomateria}`}
                codigoMateria={m.codigomateria}
                nombreMateria={m.nombremateria}
                cuatrimestre={m.cuatrimestre}
                profesor={profesor}
                onEnter={onEnter}
                tipo={tipo}
                nota={m.nota}
              />
            );
          })}
        </div>
      );
}