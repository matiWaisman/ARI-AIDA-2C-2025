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
    e.comentario ?? null
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
    e.comentario ?? null
  ];

  const r = await this.client.query(query, params);
  return r.rows[0];
}

  async obtenerEncuestasSobreMiComoProfesor(
    miLU: string
  ) {
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
    e.comentario ?? null
  ];

  const result = await this.client.query(query, params);
  return result.rows[0];
}


}