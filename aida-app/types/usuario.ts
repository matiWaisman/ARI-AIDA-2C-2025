export interface Usuario {
  id: number;
  username: string;
  esAlumno: boolean;
  esProfesor: boolean;
  lu: string;
  nombre?: string;
  email?: string;
  activo?: boolean;
}

