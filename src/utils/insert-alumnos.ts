import type { Client } from 'pg';
import { readCsv } from './read-csv.ts';
import { deleteAlumnos } from './delete-alumnos.ts'

export async function insertAlumnos(client: Client, fileAlumnosPath: string): Promise<void> {
    
    await deleteAlumnos(client);
    const alumnos = await readCsv(fileAlumnosPath);  // ✅ usar el argumento
    console.log("Datos leídos del CSV:");
    console.log(alumnos);  // 🔹 Aquí imprimimos todo el array

    for (const alumno of alumnos) {
        let queryActual = "insert into aida.alumnos (lu, apellido, nombres, titulo, titulo_en_tramite, egreso) values(";
        
        for (let clave in alumno) {
            queryActual += `'${alumno[clave]}',`;
        }

        queryActual = queryActual.slice(0, -1); // sacar coma final
        queryActual += ");";

        const res = await client.query(queryActual);
        console.log(res.command, res.rowCount);
    }
}
