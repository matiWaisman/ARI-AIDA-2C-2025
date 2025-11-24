import { Client } from "pg";

export class MateriaRepository {
  constructor(private client: Client) {}

  async getMateria(nombreMateria: string): Promise<boolean> {
    const query = `
    SELECT 1 
    FROM aida.materias 
    WHERE nombreMateria = $1 
    LIMIT 1
  `;
    const result = await this.client.query(query, [nombreMateria]);
    return result.rows.length > 0;
  }

  async crearMateria(nombre: string, codigo: string): Promise<void> {
    const query = `
      INSERT INTO aida.materias (nombre, codigo)
      VALUES ($1, $2)
    `;
    await this.client.query(query, [nombre, codigo]);
  }

  async getAllMaterias(): Promise<any[]> {
    const query = `
      SELECT
        m.nombremateria AS "nombreMateria",
        m.codigomateria AS "codigoMateria",
        e.nombres,
        e.apellido,
        d.cuatrimestre
      FROM aida.materias m
      LEFT JOIN aida.dicta d ON m.codigomateria = d.codigomateria
      LEFT JOIN aida.profesor p ON d.luprofesor = p.lu
      LEFT JOIN aida.entidadUniversitaria e ON p.lu = e.lu
      ORDER BY m.codigomateria, d.cuatrimestre, e.apellido, e.nombres;
    `;
    const result = await this.client.query(query);
    return result.rows;
  }

  async getMateriasQueParticipa(
    id: number,
    participacion: "cursa" | "dicta",
    rolEnMateria: "Alumno" | "Profesor"
  ): Promise<any[]> {
    const columnaLu = rolEnMateria === "Alumno" ? "lualumno" : "luprofesor";
    const notaColumn = participacion === "cursa" ? ", p.nota" : "";
    const query = `
    SELECT 
      m.nombremateria AS "nombreMateria", 
      p.codigomateria AS "codigoMateria", 
      e.nombres, 
      e.apellido, 
      p.cuatrimestre${notaColumn}
      FROM aida.${participacion} p
      INNER JOIN aida.usuarios u ON p.${columnaLu} = u.lu
      INNER JOIN aida.materias m ON p.codigomateria = m.codigomateria
      INNER JOIN aida.entidadUniversitaria e ON p.${columnaLu} = e.lu
      WHERE u.id = $1;
    `;
    const result = await this.client.query(query, [id]);
    return result.rows;
  }

  async getMateriasQueNoParticipa(
    id: number,
    participacion: "cursa" | "dicta",
    rolEnMateria: "Alumno" | "Profesor"
  ): Promise<any[]> {
    const columnaLu = rolEnMateria === "Alumno" ? "lualumno" : "luprofesor";
    const query = `
      WITH materiasQueNoParticipa AS (
        SELECT m2.*
          FROM aida.materias m2
          WHERE NOT EXISTS (
            SELECT p.codigomateria
              FROM aida.${participacion} p
              INNER JOIN aida.usuarios u ON p.${columnaLu} = u.lu
              WHERE u.id = $1
              AND p.codigomateria = m2.codigomateria
          )		
      )


      SELECT 
            m.nombremateria AS "nombreMateria", 
            m.codigomateria AS "codigoMateria", 
            string_agg(DISTINCT e.nombres || ' ' || e.apellido, ' / ') AS "nombres",
            ''::text AS "apellido",
            '2C2025' AS cuatrimestre
      FROM materiasQueNoParticipa m
      LEFT JOIN aida.dicta d ON m.codigomateria = d.codigomateria
      LEFT JOIN aida.entidadUniversitaria e ON d.luprofesor = e.lu
      GROUP BY m.nombremateria, m.codigomateria
    `;
    const result = await this.client.query(query, [id]);
    return result.rows;
  }

  async getMateriasQueSiParticipa(
    id: number,
    participacion: "cursa" | "dicta",
    rolEnMateria: "Alumno" | "Profesor"
  ): Promise<any[]> {
    const columnaLu = rolEnMateria === "Alumno" ? "lualumno" : "luprofesor";
    const query = `
        WITH materiasQueSiParticipa AS (
          SELECT m2.*
            FROM aida.materias m2
            WHERE EXISTS (
              SELECT p.codigomateria
                FROM aida.${participacion} p
                INNER JOIN aida.usuarios u ON p.${columnaLu} = u.lu
                WHERE u.id = $1
                AND p.codigomateria = m2.codigomateria
            )
        )

        SELECT 
              m.nombremateria AS "nombreMateria", 
              m.codigomateria AS "codigoMateria", 
              string_agg(DISTINCT e.nombres || ' ' || e.apellido, ' / ') AS "nombres",
              ''::text AS "apellido",
              '2C2025' AS cuatrimestre
        FROM materiasQueSiParticipa m
        LEFT JOIN aida.dicta d ON m.codigomateria = d.codigomateria
        LEFT JOIN aida.entidadUniversitaria e ON d.luprofesor = e.lu
        GROUP BY m.nombremateria, m.codigomateria
    `;

    const result = await this.client.query(query, [id]);
    return result.rows;
  }

  async inscribirConId(
    codigoMateria: string,
    id: number | undefined,
    tabla: "cursa" | "dicta",
    condicion: "Profesor" | "Alumno"
  ): Promise<void> {
    if (!codigoMateria) {
      throw new Error("El código de materia es requerido");
    }

    if (!id) {
      throw new Error("El ID de usuario es requerido");
    }

    const materiaCheck = await this.client.query(
      "SELECT codigomateria FROM aida.materias WHERE codigomateria = $1",
      [codigoMateria]
    );

    if (materiaCheck.rows.length === 0) {
      throw new Error(`La materia con código ${codigoMateria} no existe`);
    }

    const luResult = await this.client.query(
      "SELECT lu FROM aida.usuarios WHERE id = $1",
      [id]
    );

    if (luResult.rows.length === 0 || !luResult.rows[0].lu) {
      throw new Error("Usuario no encontrado o sin LU asignado");
    }

    const lu = luResult.rows[0].lu;

    const tablaOpuesta = tabla === "cursa" ? "dicta" : "cursa";
    const columnaOpuesta = tabla === "cursa" ? "luprofesor" : "lualumno";

    const conflictoCheck = await this.client.query(
      `SELECT 1 FROM aida.${tablaOpuesta} WHERE ${columnaOpuesta} = $1 AND codigomateria = $2 LIMIT 1`,
      [lu, codigoMateria]
    );

    if (conflictoCheck.rows.length > 0) {
      const accion = tabla === "cursa" ? "cursar" : "dictar";
      const accionOpuesta = tabla === "cursa" ? "dictando" : "cursando";
      throw new Error(
        `No podés ${accion} una materia que ya estás ${accionOpuesta}`
      );
    }

    const columnaLu = condicion === "Alumno" ? "lualumno" : "luprofesor";
    const query = `
    INSERT INTO aida.${tabla} (${columnaLu}, codigomateria, cuatrimestre)
      VALUES ($2, $1, '2C2025');`;
    await this.client.query(query, [codigoMateria, lu]);
  }

  async materiasCursadasPorAlumno(lu: string): Promise<any[]> {
    const query = `
      SELECT 
        m.nombreMateria, 
        m.codigoMateria, 
        c.cuatrimestre
      FROM aida.materias m
      JOIN aida.cursa c ON m.codigoMateria = c.codigoMateria
      WHERE c.luAlumno = $1;
    `;
    const result = await this.client.query(query, [lu]);
    return result.rows;
  }

  async obtenerAlumnosDeMateria(
    codigoMateria: string,
    cuatrimestre: string,
    luAExcluir?: string | null
  ) {
    const query = `
      SELECT a.lu, e.nombres, e.apellido
      FROM aida.cursa c
      JOIN aida.alumnos a ON c.lualumno = a.lu
      JOIN aida.entidadUniversitaria e ON e.lu = a.lu
      WHERE c.codigomateria = $1
        AND c.cuatrimestre = $2
        AND ($3::text IS NULL OR a.lu <> $3)
    `;

    const result = await this.client.query(query, [
      codigoMateria,
      cuatrimestre,
      luAExcluir ?? null,
    ]);

    return result.rows;
  }

  async obtenerProfesoresDeMateria(
    codigoMateria: string,
    cuatrimestre: string,
    luAExcluir?: string | null
  ) {
    const query = `
      SELECT p.lu, e.nombres, e.apellido
      FROM aida.dicta d
      JOIN aida.profesor p ON d.luprofesor = p.lu
      JOIN aida.entidadUniversitaria e ON e.lu = p.lu
      WHERE d.codigomateria = $1
        AND d.cuatrimestre = $2
        AND ($3::text IS NULL OR p.lu <> $3)
    `;

    const result = await this.client.query(query, [
      codigoMateria,
      cuatrimestre,
      luAExcluir ?? null,
    ]);

    return result.rows;
  }

  async obtenerAlumnosDeMateriaConNota(
    codigoMateria: string | undefined,
    cuatrimestre: string
  ) {
    const query = `
    SELECT a.lu, e.nombres, e.apellido, c.nota
      FROM aida.cursa c
      JOIN aida.alumnos a ON c.lualumno = a.lu
      JOIN aida.entidadUniversitaria e ON e.lu = a.lu
      WHERE c.codigomateria = $1
        AND c.cuatrimestre = $2
    `;

    const result = await this.client.query(query, [
      codigoMateria,
      cuatrimestre,
    ]);

    return result.rows;
  }
}
