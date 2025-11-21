"use client"

import { MateriaApi } from "./tablaInscripciones"
import { FilaMateria } from "./filaMateria"

interface TablaMateriaProps {
    Materias: MateriaApi[];
    onEnter: (codigoMateria: string) => void;
    tipo: "alumno" | "profesor";
}

export function TablaMaterias({
    Materias,
    onEnter,
    tipo
}: TablaMateriaProps) {

    return (
        <div className="w-full space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-sm font-semibold text-muted-foreground mb-4">
            <div className="col-span-4">Materia</div>
            <div className="col-span-2">Cuatrimestre</div>
            <div className="col-span-4">Profesor</div>
            <div className="col-span-2 text-right">Acción</div>
          </div>
    
          {Materias.map((m) => {
            const profesor = `${m.nombres} ${m.apellido}`;
    
            return (
              <FilaMateria
                key={`${tipo}-${m.codigoMateria}`}
                codigoMateria={m.codigoMateria}
                nombreMateria={m.nombreMateria}
                cuatrimestre={m.cuatrimestre}
                profesor={profesor}
                onEnter={onEnter}
              />
            );
          })}
        </div>
      );
}