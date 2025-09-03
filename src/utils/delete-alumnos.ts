import type { Client } from 'pg';

export async function deleteAlumnos(client: Client): Promise<void> {
    console.log("Datos eliminados de la tabla alumnos");
    let queryActual = "DELETE FROM aida.alumnos"

    const res = await client.query(queryActual);
    console.log(res.command, res.rowCount);

}

