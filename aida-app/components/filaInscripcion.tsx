"use client";

interface filaInscripcionProps {
  codigoMateria: string;
  nombreMateria: string;
  cuatrimestre: string;
  profesor: string;
  onInscripcion: (codigoMateria: string) => void;
  inscripto?: boolean;
}

export function FilaInscripcion({
  codigoMateria,
  nombreMateria,
  cuatrimestre,
  profesor,
  inscripto = false,
  onInscripcion,
}: filaInscripcionProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="border border-gray-300 px-4 py-3">
        <p className="font-medium text-gray-900">{nombreMateria}</p>
      </td>
      <td className="border border-gray-300 px-4 py-3">
        <p className="text-sm text-gray-700">{cuatrimestre}</p>
      </td>
      <td className="border border-gray-300 px-4 py-3">
        <p className="text-sm text-gray-700">{profesor}</p>
      </td>
      <td className="border border-gray-300 px-4 py-3 text-center">
        <button
          onClick={() => onInscripcion(codigoMateria)}
          disabled={inscripto}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            inscripto
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-sky-400 text-white hover:bg-sky-500 active:bg-sky-600"
          }`}
        >
          {inscripto ? "Inscripto" : "Inscribirse"}
        </button>
      </td>
    </tr>
  );
}
