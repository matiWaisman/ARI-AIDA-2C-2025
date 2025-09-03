import type { Client } from 'pg';

interface alumno {
    lu: string;
    apellido: string;
    nombres: string;
    titulo: string;
    titulo_en_tramite: string;
    egreso: string;
}

type alumnosDict = {
  [key: string]: alumno;
};

export async function getAlumnos(client: Client): Promise<alumnosDict> {
    let queryActual = "SELECT * FROM aida.alumnos"
    const listaAlumnos = await client.query<alumno>(queryActual);

    const dict: alumnosDict = {}; 

    for(const row of listaAlumnos.rows){
        dict[row.lu] = row;
    }

    return dict;

}
