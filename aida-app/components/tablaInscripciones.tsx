"use client";

import { FilaInscripcion } from "./filaInscripcion";

export interface MateriaApi {
  nombremateria: string;
  codigomateria: string;
  nombres: string;
  apellido: string;
  cuatrimestre: string;
  nota: number;
}

interface TablaInscripcionesProps {
  Materias: MateriaApi[];
  onInscripcion: (codigoMateria: string) => void;
  tipo: "alumno" | "profesor";
}

export function TablaInscripciones({
  Materias,
  onInscripcion,
  tipo
}: TablaInscripcionesProps) {
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
          <FilaInscripcion
            key={`${tipo}-${m.codigomateria}`}
            codigoMateria={m.codigomateria}
            nombreMateria={m.nombremateria}
            cuatrimestre={m.cuatrimestre}
            profesor={profesor}
            inscripto={false} 
            onInscripcion={onInscripcion}
          />
        );
      })}
    </div>
  );
}
