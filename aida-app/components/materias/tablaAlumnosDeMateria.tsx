"use client";

import FilaAlumnoDeMateria from "./filaAlumnoDeMateria";
import { Alumno } from "@/types/alumno";

type TablaAlumnosDeMateriaProps = {
  alumnos: (Alumno & { nota: number })[];
  codigoMateria: string;
  cuatrimestre: string;
  onPonerNota: (
    lu: string,
    codigoMateria: string,
    cuatrimestre: string,
    nota: number
  ) => Promise<boolean>;
};

export default function TablaAlumnosDeMateria({
  alumnos,
  codigoMateria,
  cuatrimestre,
  onPonerNota,
}: TablaAlumnosDeMateriaProps) {
  return (
    <div className="w-full shadow-lg rounded-lg overflow-hidden">
      <table className="w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              LU
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              Nombres
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              Apellido
            </th>
            <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              Nota
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {alumnos.map((alumno) => (
            <FilaAlumnoDeMateria
              key={alumno.lu}
              alumno={alumno}
              codigoMateria={codigoMateria}
              cuatrimestre={cuatrimestre}
              onPonerNota={onPonerNota}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
