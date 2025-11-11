import AlumnosClient from "./AlumnosClient";
import { apiClient } from "@/apiClient/apiClient";

export default async function AlumnosPage() {
  let alumnos = [];
  let error = null;

  try {
    alumnos = await apiClient("/all", { method: "GET" });
  } catch (e: any) {
    error = e?.message ?? "Error desconocido";
  }

  return <AlumnosClient alumnos={alumnos} error={error} />;
}
