import type { Client } from 'pg';
import type { Alumno } from '../types/alumno.ts';

export async function getPrimerAlumnoConCertificado(client: Client): Promise<Alumno | undefined> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND titulo_en_tramite IS NOT NULL ORDER BY egreso LIMIT 1"
    const listaAlumnos = await client.query<Alumno>(query);
    const res: Alumno | undefined = listaAlumnos.rows[0]; 

    return res;
}

export async function getCertificadoDeAlumnoConLU(client: Client, LU: String): Promise<Alumno> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND lu = $1"
    const queryAlumno = await client.query<Alumno>(query, [LU]);
    const alumno: Alumno = queryAlumno.rows[0]!; 
    return alumno;
}

export async function hayAlumnoConLu(client: Client, LU: String): Promise<boolean> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND lu = $1"
    const queryAlumno = await client.query<Alumno>(query, [LU]);
    return queryAlumno.rows.length > 0;
}

export async function hayAlgunAlumnoConCertificado(client: Client): Promise<Boolean> {
    let query = "SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND titulo_en_tramite IS NOT NULL ORDER BY egreso LIMIT 1"
    const resDb = await client.query<Alumno>(query);
    return (resDb.rows.length > 0);
}

export async function hayAlgunAlumnoConFechaDeseada(client: Client, fecha: String): Promise<Boolean> {
    const query = `SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND titulo_en_tramite IS NOT NULL AND egreso = '${fecha}' ORDER BY egreso LIMIT 1`;
    const resDb = await client.query<Alumno>(query);
    return (resDb.rows.length > 0);
}

export async function getAlumnosConFechaDeseada(client: Client, fecha: String): Promise<Alumno> {
    const query = `SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND titulo_en_tramite IS NOT NULL AND egreso = '${fecha}' ORDER BY egreso LIMIT 1`;
    const resDb = await client.query<Alumno>(query);
    const res: Alumno = resDb.rows[0]!; 
    return res;
}
