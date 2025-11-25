"use client";

import { useState, useRef, useEffect } from "react";
import { Alumno } from "@/types/alumno";

type Props = {
  alumno: Alumno & { nota: number };
  codigoMateria: string;
  cuatrimestre: string;
  onPonerNota: (
    lu: string,
    codigoMateria: string,
    cuatrimestre: string,
    nota: number
  ) => Promise<boolean>;
};

export default function FilaAlumnoDeMateria({
  alumno,
  codigoMateria,
  cuatrimestre,
  onPonerNota,
}: Props) {
  const [editando, setEditando] = useState(false);

  // input SIEMPRE maneja strings
  const [valor, setValor] = useState<string>(String(alumno.nota));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editando && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editando]);

  const guardar = async () => {
    const numero = Number(valor);

    if (Number.isNaN(numero)) {
      alert("La nota debe ser un número");
      return;
    }

    const ok = await onPonerNota(
      alumno.lu,
      codigoMateria,
      cuatrimestre,
      numero
    );

    if (ok) {
      setEditando(false);
    }
  };

  const cancelar = () => {
    setValor(String(alumno.nota));
    setEditando(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") guardar();
    if (e.key === "Escape") cancelar();
  };

  return (
    <>
      <tr className="hover:bg-blue-50 transition-colors duration-150">
        <td className="px-1 py-3 text-xs font-medium text-gray-900 whitespace-nowrap">
          {alumno.lu}
        </td>

        <td className="px-2 py-3 text-sm text-gray-700">{alumno.nombres}</td>

        <td className="px-2 py-3 text-sm text-gray-700">{alumno.apellido}</td>

        <td className="px-2 py-3 text-sm text-center text-gray-900 whitespace-nowrap">
          {editando ? (
            <input
              ref={inputRef}
              type="number"
              min={0}
              max={10}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              onBlur={guardar}
              onKeyDown={handleKeyDown}
              className="border-2 border-blue-500 rounded px-1 text-center w-20 bg-white focus:outline-none"
            />
          ) : (
            <div
              onClick={() => setEditando(true)}
              className="cursor-pointer hover:bg-yellow-100 hover:border hover:border-yellow-300 rounded px-2 transition-colors min-h-[24px] flex items-center justify-center text-sm"
              title="Click para editar nota"
            >
              {alumno.nota ?? "-"}
            </div>
          )}
        </td>
      </tr>
    </>
  );
}
