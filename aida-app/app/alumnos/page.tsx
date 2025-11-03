"use client";

import Tabla from "@/components/tabla";
import { useAlumnosFeature } from "@/features/alumnosFeature";

export default function AlumnosPage() {
  const { alumnos, error, loading, eliminarAlumno, insertarAlumno, actualizarAlumno } = useAlumnosFeature();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Cargando alumnos...</div>
        <div className="mt-4 border-4 border-blue-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-md">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lista de Alumnos</h1>
        <p className="text-gray-600">
          Total de alumnos: <span className="font-semibold text-blue-600">{alumnos.length}</span>
        </p>
      </div>
      
      {alumnos.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No hay alumnos registrados</p>
        </div>
      ) : (
        <Tabla alumnos={alumnos} onEliminar={eliminarAlumno} onInsertar={insertarAlumno} onActualizar={actualizarAlumno} />
      )}
    </div>
  );
}
