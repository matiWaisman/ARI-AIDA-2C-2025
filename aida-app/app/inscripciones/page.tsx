import InscripcionesClient from "./InscripcionesClient";
import { apiClient } from "@/apiClient/apiClient";

export default async function InscripcionesPage() {
  let materias = [];
  let error = null;
  let esAlumno = false;
  let esProfesor = false;

  try {
    materias = await apiClient("/materias", { method: "GET" });
    esAlumno = await apiClient("/esAlumno", { method: "GET" });
    esProfesor = await apiClient("/esProfesor", { method: "GET" });
  } catch (e: any) {
    error = e?.message ?? "Error desconocido";
  }

  return <InscripcionesClient materias={materias} esAlumno={esAlumno} esProfesor={esProfesor} error={error} />;
}
