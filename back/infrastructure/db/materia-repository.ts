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
        m.nombreMateria, 
        m.codigoMateria, 
        e.nombres, 
        e.apellido, 
        d.cuatrimestre
      FROM aida.materias m 
      LEFT JOIN aida.dicta d ON m.codigoMateria = d.codigoMateria
      LEFT JOIN aida.profesor p ON d.luProfesor = p.lu
      LEFT JOIN aida.entidadUniversitaria e ON p.lu = e.lu;
  `;
    const result = await this.client.query(query);
    console.log("Materias en la base ", result.rows)
    return result.rows;
  }

  async getMateriasQueParticipa(id: number | undefined, participacion: "cursa" | "dicta", rolEnMateria: "Alumno" | "Profesor"): Promise<any[]> {
    const query = `
    SELECT 
      p.codigoMateria
      FROM aida.${participacion} p
      INNER JOIN aida.usuarios u ON p.lu${rolEnMateria} = u.lu
      WHERE u.id = '${id}';
    `;
    const result = await this.client.query(query);
    console.log("Resultado de la Query: ", result.rows);
    return result.rows;
  }

  async inscribirConId(codigoMateria: string, id:number|undefined, tabla: "cursa"|"dicta", condicion: "Profesor"|"Alumno"): Promise<void>{
    const query = `
    INSERT INTO aida.${tabla} (lu${condicion}, codigoMateria, cuatrimestre)
      VALUES (
        (SELECT lu FROM aida.usuarios WHERE id = $2),
        $1,
        '2C2025'
    );`;
    await this.client.query(query, [codigoMateria, id]);
  }
  
}
