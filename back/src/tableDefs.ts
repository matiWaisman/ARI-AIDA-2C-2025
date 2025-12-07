export type TableName =
  | 'entidadUniversitaria'
  | 'alumnos'
  | 'profesor'
  | 'cursa'
  | 'dicta'
  | 'materias'
  | 'encuestaAAlumno'
  | 'encuestaAMateria'
  | 'encuestaAProfesor'
  | 'usuarios';

export type ColumnName =
  // Columnas comunes / compartidas
  | 'lu'
  | 'id'
  | 'apellido'
  | 'nombres'
  | 'codigoMateria'
  | 'cuatrimestre'
  | 'comentario'
  // alumnos
  | 'titulo'
  | 'titulo_en_tramite'
  | 'egreso'
  // materias
  | 'nombreMateria'
  // dicta
  | 'luProfesor'
  // cursa
  | 'luAlumno'
  | 'nota'
  // encuestas (general)
  | 'luEncuestado'
  | 'luEvaluado'
  // respuestas encuestas
  | 'respuesta1'
  | 'respuesta2'
  | 'respuesta3'
  | 'respuesta4'
  | 'respuesta5'
  | 'respuesta6'
  | 'respuesta7'
  | 'respuesta8'
  | 'respuesta9'
  | 'respuesta10'
  | 'respuesta11'
  | 'respuesta12'
  | 'respuesta13'
  | 'respuesta14'
  | 'respuesta15'
  | 'respuesta16'
  // usuarios
  | 'username'
  | 'password_hash'
  | 'email'
  | 'activo';

export type ColumnType = 'text' | 'varchar' | 'date' | 'numeric' | 'boolean' | 'integer' | 'serial';

export interface ColumnDef {
    name: ColumnName
    type: ColumnType
    title?: string
    description?: string
}
export interface ForeignKeyDef {
    column: ColumnName   
    referencedColumn: ColumnName
    referencesTable: TableName
    referencesColumns: ColumnName[]
}

export interface TableDef {
    name: TableName
    columns: ColumnDef[]
    pk: ColumnName[]
    fks: ForeignKeyDef[]
    title?: string
    orderBy?: ColumnName[]
    elementName?: string
    requiereRuta: boolean
}

const tableDefinitions: TableDef[] = [
  {
    name: 'entidadUniversitaria',
    columns: [
      { name: 'lu', type: 'text', title: 'Lu' },
      { name: 'apellido', type: 'text', title: 'Apellido' },
      { name: 'nombres', type: 'text', title: 'Nombres' },
    ],
    pk: ['lu'],
    fks: [],
    elementName: 'entidadUniversitaria',
    orderBy: ['apellido', 'nombres'],
    requiereRuta: true
  },

  {
    name: 'alumnos',
    columns: [
      { name: 'lu', type: 'text', title: 'Lu' },
      { name: 'titulo', type: 'text', title: 'Titulo' },
      { name: 'titulo_en_tramite', type: 'boolean', title: 'Titulo En Tramite' },
      { name: 'egreso', type: 'date', title: 'Egreso' },
    ],
    pk: ['lu'],
    fks: [
      {
        column: 'lu',
        referencedColumn: 'lu',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['lu']
      }
    ],
    elementName: 'alumno',
    orderBy: ['lu'],
    requiereRuta: true 
  },

  {
    name: 'profesor',
    columns: [
      { name: 'lu', type: 'text', title: 'Lu' },
      { name: 'id', type: 'integer', title: 'Id' }, // Nota: En SQL definiste id INTEGER REFERENCES usuarios
    ],
    pk: ['lu'],
    fks: [
      {
        column: 'lu',
        referencedColumn: 'lu',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['lu']
      },
      {
        column: 'id',
        referencedColumn: 'id',
        referencesTable: 'usuarios',
        referencesColumns: ['id']
      }
    ],
    elementName: 'profesor',
    orderBy: ['lu'],
    requiereRuta: false 
  },

  {
    name: 'usuarios',
    columns: [
      { name: 'id', type: 'serial', title: 'Id' },
      { name: 'username', type: 'text', title: 'Username' },
      { name: 'password_hash', type: 'text', title: 'Password Hash' },
      { name: 'apellido', type: 'text', title: 'Apellido' },
      { name: 'nombres', type: 'text', title: 'Nombres' },
      { name: 'email', type: 'text', title: 'Email' },
      { name: 'activo', type: 'boolean', title: 'Activo' },
      { name: 'lu', type: 'text', title: 'Lu' },
    ],
    pk: ['id'],
    fks: [
      {
        column: 'lu',
        referencedColumn: 'lu',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['lu']
      }
    ],
    elementName: 'Usuario',
    orderBy: ['apellido', 'nombres'],
    requiereRuta: false 
  },

  {
    name: 'materias',
    columns: [
      { name: 'codigoMateria', type: 'text', title: 'Codigo Materia' },
      { name: 'nombreMateria', type: 'text', title: 'Nombre Materia' },
    ],
    pk: ['codigoMateria'],
    fks: [],
    elementName: 'materia',
    orderBy: ['nombreMateria'],
    requiereRuta: true
  },

  {
    name: 'dicta',
    columns: [
      { name: 'luProfesor', type: 'text', title: 'Lu Profesor' },
      { name: 'codigoMateria', type: 'text', title: 'Codigo Materia' },
      { name: 'cuatrimestre', type: 'text', title: 'Cuatrimestre' },
    ],
    pk: ['luProfesor', 'codigoMateria', 'cuatrimestre'],
    fks: [
      {
        column: 'luProfesor',
        referencedColumn: 'lu',
        referencesTable: 'profesor',
        referencesColumns: ['lu']
      },
      {
        column: 'codigoMateria',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'dicta',
    orderBy: ['codigoMateria', 'cuatrimestre', 'luProfesor'],
    requiereRuta: false 
  },

  {
    name: 'cursa',
    columns: [
      { name: 'luAlumno', type: 'text', title: 'Lu Alumno' },
      { name: 'codigoMateria', type: 'text', title: 'Codigo Materia' },
      { name: 'cuatrimestre', type: 'text', title: 'Cuatrimestre' },
      { name: 'nota', type: 'numeric', title: 'Nota' },
    ],
    pk: ['luAlumno', 'codigoMateria', 'cuatrimestre'],
    fks: [
      {
        column: 'luAlumno',
        referencedColumn: 'lu',
        referencesTable: 'alumnos',
        referencesColumns: ['lu']
      },
      {
        column: 'codigoMateria',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'cursa',
    orderBy: ['luAlumno', 'codigoMateria', 'cuatrimestre'],
    requiereRuta: true 
  },

  {
    name: 'encuestaAAlumno',
    columns: [
      { name: 'luEncuestado', type: 'text', title: 'Lu Encuestado' },
      { name: 'luEvaluado', type: 'text', title: 'Lu Evaluado' },
      { name: 'codigoMateria', type: 'text', title: 'Codigo Materia' },
      { name: 'cuatrimestre', type: 'text', title: 'Cuatrimestre' },
      { name: 'respuesta1', type: 'integer', title: 'Respuesta 1' },
      { name: 'respuesta2', type: 'integer', title: 'Respuesta 2' },
      { name: 'respuesta3', type: 'integer', title: 'Respuesta 3' },
      { name: 'respuesta4', type: 'integer', title: 'Respuesta 4' },
      { name: 'respuesta5', type: 'integer',title: 'Respuesta 5' },
      { name: 'comentario', type: 'text', title: 'Comentario' },
    ],
    pk: [
      'luEncuestado',
      'luEvaluado',
      'codigoMateria',
      'cuatrimestre'
    ],
    fks: [
      {
        column: 'luEncuestado',
        referencedColumn: 'lu',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['lu']
      },
      {
        column: 'luEvaluado',
        referencedColumn: 'lu',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['lu']
      },
      {
        column: 'codigoMateria',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'Encuesta a alumno',
    orderBy: ['codigoMateria', 'cuatrimestre', 'luEvaluado'],
    requiereRuta: true
  },

  {
    name: 'encuestaAMateria',
    columns: [
      { name: 'luEncuestado', type: 'text', title: 'Lu Encuestado' },
      { name: 'codigoMateria', type: 'text', title: 'Codigo Materia' },
      { name: 'cuatrimestre', type: 'text', title: 'Cuatrimestre' },
      { name: 'respuesta1', type: 'integer', title: 'Respuesta 1' },
      { name: 'respuesta2', type: 'integer', title: 'Respuesta 2' },
      { name: 'respuesta3', type: 'integer', title: 'Respuesta 3' },
      { name: 'respuesta4', type: 'integer', title: 'Respuesta 4' },
      { name: 'respuesta5', type: 'integer', title: 'Respuesta 5' },
      { name: 'respuesta6', type: 'integer', title: 'Respuesta 6' },
      { name: 'respuesta7', type: 'integer', title: 'Respuesta 7' },
      { name: 'respuesta8', type: 'integer', title: 'Respuesta 8' },
      { name: 'respuesta9', type: 'integer', title: 'Respuesta 9' },
      { name: 'respuesta10', type: 'integer', title: 'Respuesta 10' },
      { name: 'respuesta11', type: 'integer', title: 'Respuesta 11' },
      { name: 'respuesta12', type: 'integer', title: 'Respuesta 12' },
      { name: 'respuesta13', type: 'integer', title: 'Respuesta 13' },
      { name: 'respuesta14', type: 'integer', title: 'Respuesta 14' },
      { name: 'respuesta15', type: 'integer', title: 'Respuesta 15' },
      { name: 'respuesta16', type: 'integer', title: 'Respuesta 16' },
      { name: 'comentario', type: 'text', title: 'Comentario' },
    ],
    pk: ['luEncuestado', 'codigoMateria', 'cuatrimestre'],
    fks: [
      {
        column: 'luEncuestado',
        referencedColumn: 'lu',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['lu']
      },
      {
        column: 'codigoMateria',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'Encuesta a materia',
    orderBy: ['codigoMateria', 'cuatrimestre'],
    requiereRuta: true 
  },

  {
    name: 'encuestaAProfesor',
    columns: [
      { name: 'luEncuestado', type: 'text', title: 'Lu Encuestado' },
      { name: 'luEvaluado', type: 'text', title: 'Lu Evaluado' },
      { name: 'codigoMateria', type: 'text', title: 'Codigo Materia' },
      { name: 'cuatrimestre', type: 'text', title: 'Cuatrimestre' },
      { name: 'respuesta1', type: 'integer', title: 'Respuesta 1' },
      { name: 'respuesta2', type: 'integer', title: 'Respuesta 2' },
      { name: 'respuesta3', type: 'integer', title: 'Respuesta 3' },
      { name: 'respuesta4', type: 'integer', title: 'Respuesta 4' },
      { name: 'respuesta5', type: 'integer', title: 'Respuesta 5' },
      { name: 'respuesta6', type: 'integer', title: 'Respuesta 6' },
      { name: 'respuesta7', type: 'integer', title: 'Respuesta 7' },
      { name: 'respuesta8', type: 'integer', title: 'Respuesta 8' },
      { name: 'respuesta9', type: 'integer', title: 'Respuesta 9' },
      { name: 'respuesta10', type: 'integer', title: 'Respuesta 10' },
      { name: 'respuesta11', type: 'integer', title: 'Respuesta 11' },
      { name: 'respuesta12', type: 'integer', title: 'Respuesta 12' },
      { name: 'comentario', type: 'text', title: 'Comentario' },
    ],
    pk: [
      'luEncuestado',
      'luEvaluado',
      'codigoMateria',
      'cuatrimestre'
    ],
    fks: [
      {
        column: 'luEncuestado',
        referencedColumn: 'lu',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['lu']
      },
      {
        column: 'luEvaluado',
        referencedColumn: 'lu',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['lu']
      },
      {
        column: 'codigoMateria',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'Encuesta a profesor',
    orderBy: ['codigoMateria', 'cuatrimestre', 'luEvaluado'],
    requiereRuta: true 
  }
];

export function completeTableDefaults(tableDef:TableDef[]): TableDef[]{
    return tableDef.map( t => {
        return {
            ...t,
            title: t.title ?? t.name,
            elementName: t.elementName ?? 'registro de ' + t.name,
            orderBy: t.orderBy ?? t.pk,
            columns: t.columns.map(c => {
                return {
                    ...c,
                    title: c.title ?? c.name,
                    description: c.description ?? ''
                }
            })
        }
    }) 
}

export const tableDefs = completeTableDefaults(tableDefinitions);