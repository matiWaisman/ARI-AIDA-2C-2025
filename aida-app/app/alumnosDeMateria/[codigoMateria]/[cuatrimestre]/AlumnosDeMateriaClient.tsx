"use client";

type Alumno = {
  lu: string;
  nombre: string;
};

type Props = {
  codigoMateria: string;
  cuatrimestre: string;
  alumnos: Alumno[];
};

export default function AlumnosDeMateriaClient({
  codigoMateria,
  cuatrimestre,
  alumnos,
}: Props) {
  return (
    <div>
      <h1>
        Alumnos de {codigoMateria} – {cuatrimestre}
      </h1>

      <table className="mt-4 border">
        <thead>
          <tr>
            <th className="border px-2 py-1">LU</th>
            <th className="border px-2 py-1">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a) => (
            <tr key={a.lu}>
              <td className="border px-2 py-1">{a.lu}</td>
              <td className="border px-2 py-1">{a.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
