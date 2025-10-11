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

// ===== INSERT ALUMNOS FUNCTIONS =====

const queryFiltrarAlumnosNuevos: string = `
  SELECT lu
    FROM aida.alumnos
    WHERE lu = ANY($1);
  `;

const queryUpdateAlumnoExistente: string = `
  UPDATE aida.alumnos
    SET lu = $1, apellido = $2, nombres = $3, titulo = $4, titulo_en_tramite = $5, egreso = $6
    WHERE lu = $1;
`

const queryInsertarAlumnoNuevo: string = `
  INSERT INTO aida.alumnos 
    (lu, apellido, nombres, titulo, titulo_en_tramite, egreso) 
  VALUES ($1, $2, $3, $4, $5, $6)
`;

export async function insertAlumnos(client: Client, fileAlumnosPath: string): Promise<void> {
    const alumnos = await readCsv(fileAlumnosPath);  
    console.log("Datos leídos del CSV:");
    const listaDeLus = alumnos.map(alumno => alumno.lu);
    console.log(listaDeLus);  

    const lusRepetidos = await client.query(queryFiltrarAlumnosNuevos, [listaDeLus]);
    console.log("LUs repetidos en la base de datos:");
    const listaDeLusRepetidos = lusRepetidos.rows.map(instanciaAlumno => instanciaAlumno.lu);
    console.log(listaDeLusRepetidos)
    for (const alumno of alumnos) {
      var res;
      if (listaDeLusRepetidos.some(alumnoRepetido => alumnoRepetido === alumno.lu)) {
        res = await client.query(queryUpdateAlumnoExistente, Object.values(alumno))
      } else {
        res = await client.query(queryInsertarAlumnoNuevo, Object.values(alumno));
      }
      console.log(res.command, res.rowCount);
    }
}
