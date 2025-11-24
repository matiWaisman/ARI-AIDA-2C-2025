"use client";

import { useState } from "react";

type FilaAgregarProps = {
  onInsertar: (
    lu: string,
    nombres: string,
    apellido: string,
    titulo: string,
    titulo_en_tramite: string,
    egreso: string
  ) => Promise<boolean>;
};

export default function FilaAgregar({ onInsertar }: FilaAgregarProps) {
  const [expandida, setExpandida] = useState(false);
  const [lu, setLu] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellido, setApellido] = useState("");
  const [titulo, setTitulo] = useState("");
  const [tituloEnTramite, setTituloEnTramite] = useState("");
  const [egreso, setEgreso] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExpandir = () => {
    setExpandida(!expandida);
    if (expandida) {
      setLu("");
      setNombres("");
      setApellido("");
      setTitulo("");
      setTituloEnTramite("");
      setEgreso("");
      setError(null);
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !lu.trim() ||
      !nombres.trim() ||
      !apellido.trim() ||
      !titulo.trim() ||
      !tituloEnTramite.trim() ||
      !egreso.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const exito = await onInsertar(
        lu.trim(),
        nombres.trim(),
        apellido.trim(),
        titulo.trim(),
        tituloEnTramite.trim(),
        egreso.trim()
      );
      if (exito) {
        setLu("");
        setNombres("");
        setApellido("");
        setTitulo("");
        setTituloEnTramite("");
        setEgreso("");
        setExpandida(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  if (!expandida) {
    return (
      <tr className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
        <td colSpan={7} className="px-4 py-3 text-center">
          <button
            onClick={handleExpandir}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar nuevo alumno
          </button>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className="bg-blue-50 border-t-2 border-blue-200">
        <td className="px-2 py-3" colSpan={7}>
          <form onSubmit={handleGuardar} className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  LU *
                </label>
                <input
                  type="text"
                  value={lu}
                  onChange={(e) => setLu(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 960/23"
                  required
                  disabled={guardando}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombres *
                </label>
                <input
                  type="text"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Claudio"
                  required
                  disabled={guardando}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: García"
                  required
                  disabled={guardando}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Licenciado en Ciencias de la Computación"
                  required
                  disabled={guardando}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Título en Trámite *
                </label>
                <input
                  type="date"
                  value={tituloEnTramite}
                  onChange={(e) => setTituloEnTramite(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={guardando}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Egreso *
                </label>
                <input
                  type="date"
                  value={egreso}
                  onChange={(e) => setEgreso(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={guardando}
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleExpandir}
                disabled={guardando}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {guardando ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </form>
        </td>
      </tr>
    </>
  );
}
