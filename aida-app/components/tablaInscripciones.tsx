"use client";
import { FilaInscripcion } from "./filaInscripcion";
import { Materia } from "@/types/materia";

interface TablaInscripcionesProps {
  Materias: Materia[];
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

      {Materias.map((Materia) => (
        <FilaInscripcion
          key={`${tipo}-${Materia.id}`}
          codigoMateria={Materia.id}
          nombreMateria={Materia.name}
          cuatrimestre={Materia.cuatrimestre}
          profesor={Materia.profesor}
          inscripto={Materia.inscripto}
          onInscripcion={onInscripcion}
        />
      ))}
    </div>
  );
}
