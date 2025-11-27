import type { Client } from 'pg';
import type { Alumno, AlumnosDict } from '../../domain/entity/alumno.ts';
import { readCsv } from '../files/read-csv.ts';

// ===== GET ALUMNOS FUNCTIONS =====

export async function getAlumnos(client: Client): Promise<AlumnosDict> {
    const query = "SELECT * FROM aida.alumnos"
    const listaAlumnos = await client.query<Alumno>(query);

    const dict: AlumnosDict = {}; 

    for(const row of listaAlumnos.rows){
        dict[row.lu] = row;
    }
    return dict;
}

// ===== DELETE ALUMNOS FUNCTIONS =====

export async function deleteAlumnos(client: Client): Promise<void> {
    console.log("Datos eliminados de la tabla alumnos");
    let queryActual = "DELETE FROM aida.alumnos"

    const res = await client.query(queryActual);
    console.log(res.command, res.rowCount);
}

// ===== QUERIES =====

// Solo existen estas columnas en alumnos:
const queryUpdateAlumno = `
  UPDATE aida.alumnos
    SET titulo = $2, titulo_en_tramite = $3, egreso = $4
    WHERE lu = $1;
`;

const queryInsertAlumno = `
  INSERT INTO aida.alumnos (lu, titulo, titulo_en_tramite, egreso)
  VALUES ($1, $2, $3, $4);
`;

// apellido y nombres van en entidadUniversitaria
const queryUpsertEntidadUniversitaria = `
  INSERT INTO aida.entidadUniversitaria (lu, apellido, nombres)
  VALUES ($1, $2, $3)
  ON CONFLICT (lu)
  DO UPDATE SET apellido = EXCLUDED.apellido, nombres = EXCLUDED.nombres;
`;

const querySelectAlumnosExistentes = `
  SELECT lu FROM aida.alumnos WHERE lu = ANY($1);
`;

export async function insertAlumnos(client: Client, fileAlumnosPath: string): Promise<void> {
  console.log("Leyendo CSV de alumnos…");
  const alumnos = await readCsv(fileAlumnosPath);

  const listaDeLus = alumnos.map(a => a.lu);
  const lusRepetidosRes = await client.query(querySelectAlumnosExistentes, [listaDeLus]);
  const lusRepetidos = lusRepetidosRes.rows.map(r => r.lu);

  for (const alumno of alumnos) {
    // 1) Primero apellido + nombres → entidadUniversitaria
    await client.query(
      queryUpsertEntidadUniversitaria,
      [alumno.lu, alumno.apellido, alumno.nombres]
    );

    // 2) Luego insertar/actualizar datos de alumnos
    const paramsAlumno = [
      alumno.lu,
      alumno.titulo,
      alumno.titulo_en_tramite,
      alumno.egreso
    ];

    let res;
    if (lusRepetidos.includes(alumno.lu)) {
      res = await client.query(queryUpdateAlumno, paramsAlumno);
    } else {
      res = await client.query(queryInsertAlumno, paramsAlumno);
    }

    console.log(res.command, res.rowCount, alumno.lu);
  }
}
