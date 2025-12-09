import { Client } from "pg";

export class EncuestasRepository {
  constructor(private client: Client) {}

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

    const queryPromedios = `
      SELECT 
        e.codigoMateria,
        m.nombreMateria, 
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
      INNER JOIN aida.materias m ON e.codigoMateria = m.codigoMateria
      WHERE e.codigoMateria = '${codigoMateria}'
        AND e.cuatrimestre = '${cuatrimestre}'
      GROUP BY e.codigoMateria, e.cuatrimestre, m.nombreMateria
    `;

    const resultPromedios = await this.client.query(queryPromedios);

    const queryComentarios = `
      SELECT 
        comentario
      FROM aida.encuestaAMateria
      WHERE codigoMateria = '${codigoMateria}'
        AND cuatrimestre = '${cuatrimestre}'
        AND comentario IS NOT NULL
        AND comentario <> ''
    `;

    const resultComentarios = await this.client.query(queryComentarios);

    const comentarios = resultComentarios.rows.map(r => r.comentario);

    const encuestas = resultPromedios.rows.map((row) => ({
      nombreEncuestado: row.nombremateria,  
      resultados: [
        Number(row.respuesta1),
        Number(row.respuesta2),
        Number(row.respuesta3),
        Number(row.respuesta4),
        Number(row.respuesta5),
        Number(row.respuesta6),
        Number(row.respuesta7),
        Number(row.respuesta8),
        Number(row.respuesta9),
        Number(row.respuesta10),
        Number(row.respuesta11),
        Number(row.respuesta12),
        Number(row.respuesta13),
        Number(row.respuesta14),
        Number(row.respuesta15),
        Number(row.respuesta16),
      ],
      comentarios: comentarios
    }));

    return encuestas;
  }


  async obtenerEncuestasDeProfesorEnMateriaYCuatri(codigoMateria: string, cuatrimestre: string) {
    const promedios = await this.client.query(`
      SELECT e.luEvaluado,
      eu.nombres,
      eu.apellido, 
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
      INNER JOIN aida.entidadUniversitaria eu ON e.luEvaluado = eu.lu
      WHERE e.codigoMateria = '${codigoMateria}'
        AND e.cuatrimestre = '${cuatrimestre}'
      GROUP BY e.codigoMateria, e.cuatrimestre, e.luEvaluado, eu.nombres, eu.apellido
    `);
    
    const resultadosFinales = [];

    for (const row of promedios.rows) {
      const comentariosQuery = await this.client.query(
        `
          SELECT comentario
          FROM aida.encuestaAProfesor
          WHERE luEvaluado = $1
            AND codigoMateria = $2
            AND cuatrimestre = $3
            AND comentario IS NOT NULL
            AND comentario <> ''
        `,
        [row.luevaluado, codigoMateria, cuatrimestre]
      );

      resultadosFinales.push({
        nombreEncuestado: `${row.nombres} ${row.apellido}`,
        resultados: [
          Number(row.respuesta1),
          Number(row.respuesta2),
          Number(row.respuesta3),
          Number(row.respuesta4),
          Number(row.respuesta5),
          Number(row.respuesta6),
          Number(row.respuesta7),
          Number(row.respuesta8),
          Number(row.respuesta9),
          Number(row.respuesta10),
          Number(row.respuesta11),
          Number(row.respuesta12),

        ],
        comentarios: comentariosQuery.rows.map((r: any) => r.comentario),
      });
    }

    return resultadosFinales;
  }


  async obtenerEncuestasDeAlumnosEnMateriaYCuatri(codigoMateria: string, cuatrimestre: string) {
    const promedios = await this.client.query(`
      SELECT 
        e.luEvaluado,
        eu.nombres,
        eu.apellido, 
        AVG(respuesta1) AS respuesta1, 
        AVG(respuesta2) AS respuesta2,
        AVG(respuesta3) AS respuesta3,
        AVG(respuesta4) AS respuesta4,
        AVG(respuesta5) AS respuesta5
      FROM aida.encuestaAAlumno e
      INNER JOIN aida.entidadUniversitaria eu ON e.luEvaluado = eu.lu
      WHERE e.codigoMateria = $1
        AND e.cuatrimestre = $2
      GROUP BY e.luEvaluado, eu.nombres, eu.apellido
    `, [codigoMateria, cuatrimestre]);

    const resultadosFinales = [];

    for (const row of promedios.rows) {
      const comentariosQuery = await this.client.query(
        `
          SELECT comentario
          FROM aida.encuestaAAlumno
          WHERE luEvaluado = $1
            AND codigoMateria = $2
            AND cuatrimestre = $3
            AND comentario IS NOT NULL
            AND comentario <> ''
        `,
        [row.luevaluado, codigoMateria, cuatrimestre]
      );

      resultadosFinales.push({
        nombreEncuestado: `${row.nombres} ${row.apellido}`,
        resultados: [
          Number(row.respuesta1),
          Number(row.respuesta2),
          Number(row.respuesta3),
          Number(row.respuesta4),
          Number(row.respuesta5),
        ],
        comentarios: comentariosQuery.rows.map((r: any) => r.comentario),
      });
    }

    return resultadosFinales;
  }


}
