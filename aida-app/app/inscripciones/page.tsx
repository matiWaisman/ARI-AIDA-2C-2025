import InscripcionesClient from "./InscripcionesClient";
import { apiClient } from "@/apiClient/apiClient";

export default async function InscripcionesPage() {
  let materias = [];
  let error = null;

  try {
    materias = await apiClient("/materias", { method: "GET" });
  } catch (e: any) {
    error = e?.message ?? "Error desconocido";
  }

  return <InscripcionesClient materias={materias} error={error} />;
}
