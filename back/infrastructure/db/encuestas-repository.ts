import { Client } from "pg";

export class EncuestasRepository {
  constructor(private client: Client) {}

  async crearEncuestaAAlumno(e: {
    luEncuestado: string;
    luEvaluado: string;
    codigoMateria: string;
    cuatrimestre: string;
    respuestas: number[];
    comentario?: string;
  }) {
    const query = `
    INSERT INTO aida.encuestaAAlumno(
      luEncuestado, luEvaluado, codigoMateria, cuatrimestre,
      respuesta1, respuesta2, respuesta3, respuesta4, respuesta5,
      comentario
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9,
      $10
    ) RETURNING *;
  `;

    const params = [
      e.luEncuestado,
      e.luEvaluado,
      e.codigoMateria,
      e.cuatrimestre,
      e.respuestas[0],
      e.respuestas[1],
      e.respuestas[2],
      e.respuestas[3],
      e.respuestas[4],
      e.comentario ?? null,
    ];

    const r = await this.client.query(query, params);
    return r.rows[0];
  }

  async crearEncuestaAMateria(e: {
    luEncuestado: string;
    codigoMateria: string;
    cuatrimestre: string;
    respuestas: number[];
    comentario?: string;
  }) {
    const query = `
    INSERT INTO aida.encuestaAMateria(
      luEncuestado, codigoMateria, cuatrimestre,
      respuesta1, respuesta2, respuesta3, respuesta4,
      respuesta5, respuesta6, respuesta7, respuesta8,
      respuesta9, respuesta10, respuesta11, respuesta12,
      respuesta13, respuesta14, respuesta15, respuesta16,
      comentario
    ) VALUES (
      $1, $2, $3,
      $4, $5, $6, $7,
      $8, $9, $10, $11,
      $12, $13, $14, $15,
      $16, $17, $18, $19,
      $20
    ) RETURNING *;
  `;

    const params = [
      e.luEncuestado,
      e.codigoMateria,
      e.cuatrimestre,
      ...e.respuestas,
      e.comentario ?? null,
    ];

    const r = await this.client.query(query, params);
    return r.rows[0];
  }

  async obtenerEncuestasSobreMiComoProfesor(miLU: string) {
    const query = `
      SELECT *
      FROM aida.encuestaAAlumno
      WHERE luEvaluado = $1;
    `;

    const r = await this.client.query(query, [miLU]);
    return r.rows;
  }

  async obtenerEncuestasSobreMiComoAlumno(miLU: string) {
    const query = `
    SELECT *
    FROM aida.encuestaAProfesor
    WHERE luEvaluado = $1;
  `;

    const r = await this.client.query(query, [miLU]);
    return r.rows;
  }

  async crearEncuestaAProfesor(e: {
    luEncuestado: string;
    luEvaluado: string;
    codigoMateria: string;
    cuatrimestre: string;
    respuestas: number[];
    comentario?: string;
  }) {
    const query = `
    INSERT INTO aida.encuestaAProfesor(
      luEncuestado,
      luEvaluado,
      codigoMateria,
      cuatrimestre,
      respuesta1,
      respuesta2,
      respuesta3,
      respuesta4,
      respuesta5,
      respuesta6,
      respuesta7,
      respuesta8,
      respuesta9,
      respuesta10,
      respuesta11,
      respuesta12,
      comentario
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
    RETURNING *;
  `;

    const params = [
      e.luEncuestado,
      e.luEvaluado,
      e.codigoMateria,
      e.cuatrimestre,
      ...e.respuestas,
      e.comentario ?? null,
    ];

    const result = await this.client.query(query, params);
    return result.rows[0];
  }

  async obtenerEncuestasNoRespondidas(lu: string) {
    const query = `
  WITH
  materias_alumno AS (
      SELECT c.codigoMateria, c.cuatrimestre
      FROM aida.cursa c
      WHERE c.luAlumno = $1
  ),

  materias_profesor AS (
      SELECT d.codigoMateria, d.cuatrimestre, d.luProfesor
      FROM aida.dicta d
      WHERE d.luProfesor = $1
  ),

  pendientes_materia AS (
      SELECT 
          m.codigoMateria    AS "codigoMateria",
          m.cuatrimestre     AS "cuatrimestre",
          mat.nombreMateria  AS "nombreMateria",
          'encuestaAMateria' AS "tipoEncuesta",
          NULL::text         AS "luEvaluado"
      FROM materias_alumno m
      JOIN aida.materias mat ON mat.codigoMateria = m.codigoMateria
      LEFT JOIN aida.encuestaAMateria e
        ON e.luEncuestado = $1
       AND e.codigoMateria = m.codigoMateria
       AND e.cuatrimestre = m.cuatrimestre
      WHERE e.luEncuestado IS NULL
  ),

  pendientes_a_profesor AS (
      SELECT 
          m.codigoMateria   AS "codigoMateria",
          m.cuatrimestre    AS "cuatrimestre",
          mat.nombreMateria AS "nombreMateria",
          'encuestaAProfesor' AS "tipoEncuesta",
          p.luProfesor      AS "luEvaluado"
      FROM materias_profesor p
      JOIN materias_alumno m
           ON m.codigoMateria = p.codigoMateria
          AND m.cuatrimestre = p.cuatrimestre
      JOIN aida.materias mat ON mat.codigoMateria = m.codigoMateria
      LEFT JOIN aida.encuestaAProfesor e
        ON e.luEncuestado = $1
       AND e.luEvaluado = p.luProfesor
       AND e.codigoMateria = p.codigoMateria
       AND e.cuatrimestre = p.cuatrimestre
      WHERE e.luEncuestado IS NULL
  ),

  pendientes_a_alumno AS (
      SELECT 
          c.codigoMateria   AS "codigoMateria",
          c.cuatrimestre    AS "cuatrimestre",
          mat.nombreMateria AS "nombreMateria",
          'encuestaAAlumno' AS "tipoEncuesta",
          c.luAlumno        AS "luEvaluado"
      FROM materias_profesor p
      JOIN aida.cursa c
           ON c.codigoMateria = p.codigoMateria
          AND c.cuatrimestre = p.cuatrimestre
      JOIN aida.materias mat ON mat.codigoMateria = c.codigoMateria
      LEFT JOIN aida.encuestaAAlumno e
        ON e.luEncuestado = $1
       AND e.luEvaluado = c.luAlumno
       AND e.codigoMateria = c.codigoMateria
       AND e.cuatrimestre = c.cuatrimestre
      WHERE e.luEncuestado IS NULL
  )

  SELECT * FROM pendientes_materia
  UNION ALL
  SELECT * FROM pendientes_a_profesor
  UNION ALL
  SELECT * FROM pendientes_a_alumno;
  `;

    const result = await this.client.query(query, [lu]);
    return result.rows;
  }

  async obtenerEncuestasDeMateriaDeCuatri(codigoMateria: string, cuatrimestre: string) {
    const query = `
    SELECT e.codigoMateria, 
      AVG(respuesta1) AS respuesta1, 
      AVG(respuesta2) AS respuesta2,
      AVG(respuesta3) AS respuesta3,
      AVG(respuesta4) AS respuesta4,
      AVG(respuesta5) AS respuesta5,
      AVG(respuesta6) AS respuesta6,
      AVG(respuesta7) AS respuesta7,
      AVG(respuesta8) AS respuesta8,
      AVG(respuesta9) AS respuesta9,
      AVG(respuesta10) AS respuesta10,
      AVG(respuesta11) AS respuesta11,
      AVG(respuesta12) AS respuesta12,
      AVG(respuesta13) AS respuesta13,
      AVG(respuesta14) AS respuesta14,
      AVG(respuesta15) AS respuesta15,
      AVG(respuesta16) AS respuesta16
      FROM aida.encuestaAMateria e
      WHERE e.codigoMateria = '${codigoMateria}'
      AND e.cuatrimestre = '${cuatrimestre}'
      GROUP BY e.codigoMateria, e.cuatrimestre
    `;

    const result = await this.client.query(query);
    return result.rows;
  }

  async obtenerEncustasDeProfesorEnMateriaYCuatri(codigoMateria: string, cuatrimestre: string) {
    const query = `
    SELECT e.luEvaluado, 
	    AVG(respuesta1) AS respuesta1, 
	    AVG(respuesta2) AS respuesta2,
      AVG(respuesta3) AS respuesta3,
      AVG(respuesta4) AS respuesta4,
      AVG(respuesta5) AS respuesta5,
      AVG(respuesta6) AS respuesta6,
      AVG(respuesta7) AS respuesta7,
      AVG(respuesta8) AS respuesta8,
      AVG(respuesta9) AS respuesta9,
      AVG(respuesta10) AS respuesta10,
      AVG(respuesta11) AS respuesta11,
      AVG(respuesta12) AS respuesta12
      FROM aida.encuestaAProfesor e
      WHERE e.codigoMateria = '${codigoMateria}'
      AND e.cuatrimestre = '${cuatrimestre}'
      GROUP BY e.codigoMateria, e.cuatrimestre, e.luEvaluado
    `;

    const result = await this.client.query(query);
    return result.rows;
  }

  async obtenerEncuestasDeAlumnosEnMateriaYCuatri(codigoMateria: string, cuatrimestre: string) {
    const query = `
    SELECT e.luEvaluado, 
      AVG(respuesta1) AS respuesta1, 
      AVG(respuesta2) AS respuesta2,
      AVG(respuesta3) AS respuesta3,
      AVG(respuesta4) AS respuesta4,
      AVG(respuesta5) AS respuesta5
      FROM aida.encuestaAAlumno e
      WHERE e.codigoMateria = '${codigoMateria}'
      AND e.cuatrimestre = '${cuatrimestre}'
      GROUP BY e.codigoMateria, e.cuatrimestre, e.luEvaluado
    `;

    const result = await this.client.query(query);
    return result.rows;
  }

}
