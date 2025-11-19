export interface Usuario {
  id: number;
  username: string;
  esAlumno: boolean;
  esProfesor: boolean;
  nombre?: string;
  email?: string;
  activo?: boolean;
}

