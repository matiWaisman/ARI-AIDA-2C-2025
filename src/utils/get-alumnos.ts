import type { Client } from 'pg';
import type { Alumno, AlumnosDict } from '../types/alumno.ts';

export async function getAlumnos(client: Client): Promise<AlumnosDict> {
    const query = "SELECT * FROM aida.alumnos"
    const listaAlumnos = await client.query<Alumno>(query);

    const dict: AlumnosDict = {}; 

    for(const row of listaAlumnos.rows){
        dict[row.lu] = row;
    }

    return dict;

}
