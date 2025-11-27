import { useState, useRef, useEffect } from "react";
import { Alumno } from "@/types/alumno";

type FilaTablaProps = {
  alumno: Alumno;
  onEliminar: (lu: string) => Promise<boolean>;
  onActualizar: (
    lu: string,
    nombres: string,
    apellido: string
  ) => Promise<boolean>;
};

export default function FilaTabla({
  alumno,
  onEliminar,
  onActualizar,
}: FilaTablaProps) {
  const [eliminando, setEliminando] = useState(false);
  const [editando, setEditando] = useState<{
    campo: "lu" | "nombres" | "apellido" | null;
    valor: string;
  }>({ campo: null, valor: "" });
  const [valores, setValores] = useState({
    lu: alumno.lu || "",
    nombres: alumno.nombres || "",
    apellido: alumno.apellido || "",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editando.campo && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editando.campo]);

  const formatearFecha = (fecha: string | null | undefined): string => {
    if (!fecha) return "-";
    try {
      const fechaStr = String(fecha);
      const fechaParte = fechaStr.split("T")[0].split(" ")[0];
      const partes = fechaParte.split("-");
      if (partes.length === 3) {
        const [año, mes, dia] = partes;
        return `${dia}/${mes}/${año}`;
      }
      const date = new Date(fechaStr);
      if (!isNaN(date.getTime())) {
        const dia = String(date.getDate()).padStart(2, "0");
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
      }
      return fechaStr;
    } catch {
      return String(fecha);
    }
  };

  useEffect(() => {
    setValores({
      lu: alumno.lu || "",
      nombres: alumno.nombres || "",
      apellido: alumno.apellido || "",
    });
  }, [alumno]);

  const handleEliminar = async () => {
    if (!alumno.lu) return;

    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar al alumno ${alumno.nombres} ${alumno.apellido} (LU: ${alumno.lu})?`
      )
    ) {
      return;
    }

    setEliminando(true);
    await onEliminar(alumno.lu);
    setEliminando(false);
  };

  const handleIniciarEdicion = (campo: "lu" | "nombres" | "apellido") => {
    setEditando({ campo, valor: valores[campo] });
  };

  const handleCancelarEdicion = () => {
    setEditando({ campo: null, valor: "" });
    setValores({
      lu: alumno.lu || "",
      nombres: alumno.nombres || "",
      apellido: alumno.apellido || "",
    });
  };

  const handleGuardarEdicion = async () => {
    if (!editando.campo) {
      return;
    }

    const valorTrimmed = editando.valor.trim();

    // Si el valor está vacío o no cambió, cancelar
    if (!valorTrimmed || valorTrimmed === valores[editando.campo]) {
      handleCancelarEdicion();
      return;
    }

    const nuevosValores = { ...valores, [editando.campo]: valorTrimmed };

    try {
      const exito = await onActualizar(
        nuevosValores.lu,
        nuevosValores.nombres,
        nuevosValores.apellido
      );
      if (exito) {
        setValores(nuevosValores);
        setEditando({ campo: null, valor: "" });
      } else {
        handleCancelarEdicion();
      }
    } catch (error) {
      handleCancelarEdicion();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGuardarEdicion();
    } else if (e.key === "Escape") {
      handleCancelarEdicion();
    }
  };

  const renderCeldaEditable = (
    campo: "lu" | "nombres" | "apellido",
    valor: string,
    claseBase: string
  ) => {
    const estaEditando = editando.campo === campo;

    if (estaEditando) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editando.valor}
          onChange={(e) => setEditando({ campo, valor: e.target.value })}
          onBlur={handleGuardarEdicion}
          onKeyDown={handleKeyDown}
          className={`${claseBase} border-2 border-blue-500 rounded px-1 bg-white focus:outline-none`}
          style={{ minWidth: "100px", width: "100%" }}
        />
      );
    }

    return (
      <div
        onClick={() => handleIniciarEdicion(campo)}
        className={`${claseBase} cursor-pointer hover:bg-yellow-100 hover:border hover:border-yellow-300 rounded px-1 transition-colors min-h-[24px] flex items-center`}
        title="Click para editar"
      >
        {valor || "-"}
      </div>
    );
  };

  return (
    <tr className="hover:bg-blue-50 transition-colors duration-150">
      <td className="px-1 py-3 text-xs font-medium text-gray-900 whitespace-nowrap">
        {renderCeldaEditable("lu", valores.lu, "text-xs")}
      </td>
      <td className="px-2 py-3 text-sm text-gray-700">
        {renderCeldaEditable("nombres", valores.nombres, "text-sm")}
      </td>
      <td className="px-2 py-3 text-sm text-gray-700">
        {renderCeldaEditable("apellido", valores.apellido, "text-sm")}
      </td>
      <td className="px-2 py-3 text-sm text-gray-700 break-words">
        {alumno.titulo || "-"}
      </td>
      <td className="px-2 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[140px]">
        {formatearFecha(alumno.titulo_en_tramite)}
      </td>
      <td className="px-2 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[140px]">
        {formatearFecha(alumno.egreso)}
      </td>
      <td className="px-2 py-3 text-sm text-center whitespace-nowrap">
        <button
          onClick={handleEliminar}
          disabled={eliminando}
          className="w-8 h-8 flex items-center justify-center text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded shadow-md hover:from-red-600 hover:via-red-700 hover:to-red-800 transform hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          title="Eliminar alumno"
        >
          {eliminando ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </td>
    </tr>
  );
}
