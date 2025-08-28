import { readCsv } from './read-csv.ts';

export async function insertAlumnos(client, fileAlumnosPath: string): Promise<void> {
    const alumnos = await readCsv(fileAlumnosPath);  // ✅ usar el argumento

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
