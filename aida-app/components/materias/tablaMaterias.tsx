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

interface MateriaAgrupada {
  nombreMateria: string;
  codigoMateria: string;
  cuatrimestre: string;
  nota?: number;
  profesores: string[];
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
  nombreCampoAux,
}: TablaMateriasProps) {
  if (Materias.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay materias disponibles
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
              Profesores
            </th>
            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
              {nombreCampoAux}
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.values(
            Materias.reduce((acc, m) => {
              const key = `${m.codigoMateria}-${m.cuatrimestre}`;
              const nombreCompleto = `${m.nombres || ""} ${
                m.apellido || ""
              }`.trim();

              if (!acc[key]) {
                acc[key] = {
                  nombreMateria: m.nombreMateria,
                  codigoMateria: m.codigoMateria,
                  cuatrimestre: m.cuatrimestre,
                  nota: m.nota,
                  profesores: nombreCompleto ? [nombreCompleto] : [],
                };
              } else if (
                nombreCompleto &&
                !acc[key].profesores.includes(nombreCompleto)
              ) {
                acc[key].profesores.push(nombreCompleto);
              }

              return acc;
            }, {} as Record<string, MateriaAgrupada>)
          ).map((m) => {
            const profesoresTexto =
              m.profesores.length > 0
                ? m.profesores.join(" / ")
                : "Sin profesor asignado";

            return (
              <FilaMateria
                key={`${tipo}-${m.codigoMateria}-${m.cuatrimestre}`}
                codigoMateria={m.codigoMateria}
                nombreMateria={m.nombreMateria}
                cuatrimestre={m.cuatrimestre}
                profesor={profesoresTexto}
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
