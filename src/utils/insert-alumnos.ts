import type { Client } from 'pg';
import { readCsv } from './read-csv.ts';
import { deleteAlumnos } from './delete-alumnos.ts';

const query: string = `
  INSERT INTO aida.alumnos 
    (lu, apellido, nombres, titulo, titulo_en_tramite, egreso) 
  VALUES ($1, $2, $3, $4, $5, $6)
`;

export async function insertAlumnos(client: Client, fileAlumnosPath: string): Promise<void> {
    await deleteAlumnos(client);
    const alumnos = await readCsv(fileAlumnosPath);  
    console.log("Datos leídos del CSV:");
    console.log(alumnos);  

    for (const alumno of alumnos) {
        const res = await client.query(query, Object.values(alumno));
        console.log(res.command, res.rowCount);
    }
}
