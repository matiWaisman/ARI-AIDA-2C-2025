import { Alumno } from "@/types/alumno";
import FilaTabla from "./filaTabla";
import FilaAgregar from "./filaAgregar";

type TablaProps = {
  alumnos: Alumno[];
  onEliminar: (lu: string) => Promise<boolean>;
  onInsertar: (
    lu: string,
    nombres: string,
    apellido: string,
    titulo: string,
    titulo_en_tramite: string,
    egreso: string
  ) => Promise<boolean>;
  onActualizar: (
    lu: string,
    nombres: string,
    apellido: string
  ) => Promise<boolean>;
};

export default function Tabla({
  alumnos,
  onEliminar,
  onInsertar,
  onActualizar,
}: TablaProps) {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      <table
        className="w-full bg-white border border-gray-200"
        style={{ tableLayout: "fixed" }}
      >
        <colgroup>
          <col className="w-[6%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[22%]" />
          <col className="w-[12%]" />
          <col className="w-[10%]" />
          <col className="w-[12%]" />
        </colgroup>
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
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              Título
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              Título en Trámite
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              Egreso
            </th>
            <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {alumnos.map((alumno, index) => (
            <FilaTabla
              key={alumno.lu || index}
              alumno={alumno}
              onEliminar={onEliminar}
              onActualizar={onActualizar}
            />
          ))}
          <FilaAgregar onInsertar={onInsertar} />
        </tbody>
      </table>
    </div>
  );
}
