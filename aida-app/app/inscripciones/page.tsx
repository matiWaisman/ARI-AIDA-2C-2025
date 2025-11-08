"use client";
import { TablaInscripciones} from "@/components/tablaInscripciones";
import { useMateriasFeature } from "@/features/materiasFeature";


export default function Inscripciones() {
  const { materias, error, loading } = useMateriasFeature();
  console.log("Materias recibidas:", materias);
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
    <>
      <h1 className="mb-8 text-3xl font-bold text-center"> Inscribirse a materias</h1>
      <TablaInscripciones
        Materias={materias}
        onInscripcion={(codigoMateria: string) => {
          console.log(`Inscripto en la materia con código: ${codigoMateria}`);
        }}
        tipo="alumno"
      />
      <h1 className="mb-8 text-3xl font-bold text-center"> Dictar materias</h1>
      <TablaInscripciones
        Materias={materias}
        onInscripcion={(codigoMateria: string) => {
          console.log(`Inscripto en la materia con código: ${codigoMateria}`);
        }}
        tipo="profesor"
      />
    </>
    
  );
}
