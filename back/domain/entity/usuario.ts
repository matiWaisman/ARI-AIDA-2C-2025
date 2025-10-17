export interface Usuario {
  id: number,
  username: string,
  nombre: string,
  email: string,
  activo: boolean,
}

export function usurioToJSON(usuario: Usuario): string {
  return JSON.stringify(usuario);
}
