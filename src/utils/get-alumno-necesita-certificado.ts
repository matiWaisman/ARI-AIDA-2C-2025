import type { Client } from 'pg';
import type { Alumno } from '../types/alumno.ts';

export async function getPrimerAlumnoConCertificado(client: Client): Promise<Alumno | undefined> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND titulo_en_tramite IS NOT NULL ORDER BY egreso LIMIT 1"
    const listaAlumnos = await client.query<Alumno>(query);
    // No deberia ser undefined porque primero vamos a testear que exista. Pero asi no chilla ts
    const res: Alumno | undefined = listaAlumnos.rows[0]; 

    return res;
}

export async function hayAlgunAlumnoConCertificado(client: Client): Promise<Boolean> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND titulo_en_tramite IS NOT NULL ORDER BY egreso LIMIT 1"
    const resDb = await client.query<Alumno>(query);
    // Si hay respuesta es porque hay alguno, si no hay es porque no hay ninguno
    return (resDb.rows.length > 0);
}

