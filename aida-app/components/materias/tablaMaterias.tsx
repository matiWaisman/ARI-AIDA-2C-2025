"use client";

import { FilaMateria } from "./filaMateria";

export interface MateriaApi {
  nombreMateria: string;
  codigoMateria: string;
  nombres: string;
  apellido: string;
  cuatrimestre: string;
  nota?: number;
}

interface TablaMateriasProps {
  Materias: MateriaApi[];
  onAccion?: (codigoMateria: string, cuatrimestre: string) => void;
  tipo: "inscripcion" | "participacion";
  nombreCampoAux: string;
}

export function TablaMaterias({
  Materias,
  onAccion,
  tipo,
  nombreCampoAux
}: TablaMateriasProps) {
  if (Materias.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay materias disponibles para inscribirse
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-300">
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Materia
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Cuatrimestre
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Profesor
            </th>
            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
              {nombreCampoAux}
            </th>
          </tr>
        </thead>
        <tbody>
          {Materias.map((m) => {
            const profesor = `${m.nombres || ""} ${m.apellido || ""}`.trim() || "Sin profesor asignado";

            return (
              <FilaMateria
                key={`${tipo}-${m.codigoMateria}`}
                codigoMateria={m.codigoMateria}
                nombreMateria={m.nombreMateria}
                cuatrimestre={m.cuatrimestre}
                profesor={profesor}
                inscripto={false} 
                onAccion={onAccion}
                tipo={tipo}
                nota={m.nota}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

