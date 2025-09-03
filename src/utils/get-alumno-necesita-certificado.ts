import type { Client } from 'pg';
import type { Alumno } from '../types/alumno.ts';

export async function getPrimerAlumnoConCertificado(client: Client): Promise<Alumno | undefined> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND titulo_en_tramite IS NOT NULL ORDER BY egreso LIMIT 1"
    const listaAlumnos = await client.query<Alumno>(query);
    const res: Alumno | undefined = listaAlumnos.rows[0]; 

    return res;
}

export async function getCertificadoDeAlumnoConLU(client: Client, LU: String): Promise<Alumno | undefined> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND lu = $1"
    const queryAlumno = await client.query<Alumno>(query, [LU]);
    const alumno: Alumno | undefined = queryAlumno.rows[0]
    return alumno
}

export async function hayAlgunAlumnoConCertificado(client: Client): Promise<Boolean> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND titulo_en_tramite IS NOT NULL ORDER BY egreso LIMIT 1"
    const resDb = await client.query<Alumno>(query);
    // Si hay respuesta es porque hay alguno, si no hay es porque no hay ninguno
    return (resDb.rows.length > 0);
}

