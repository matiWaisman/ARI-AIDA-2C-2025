import { Alumno } from "@/types/alumno";

type FilaTablaProps = {
  alumno: Alumno;
};

export default function FilaTabla({
  alumno
}: FilaTablaProps) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-2">{alumno.nombres}</td>
      <td className="px-4 py-2">{alumno.apellido}</td>
      <td className="px-4 py-2">{alumno.titulo}</td>
      <td className="px-4 py-2">{alumno.titulo_en_tramite}</td>
      <td className="px-4 py-2">{alumno.egreso}</td>
      <td className="px-4 py-2">{alumno.lu}</td>
    </tr>
  );
}
