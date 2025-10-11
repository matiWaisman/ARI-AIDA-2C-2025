export interface Alumno {
  lu: string;
  apellido: string;
  nombres: string;
  titulo: string;
  titulo_en_tramite: string;
  egreso: string;
}

// Definimos el tipo para el diccionario que va a ser compuesto por alumnos.
export type AlumnosDict = {
  [key: string]: Alumno;
};

export function alumnoToJSON(alumno: Alumno): string {
  return JSON.stringify(alumno);
}
