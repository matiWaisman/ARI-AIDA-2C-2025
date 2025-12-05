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
  // entidadUniversitaria
  | 'luEntidad'
  | 'nombresEntidad'
  | 'apellidoEntidad'
  // alumnos
  | 'luAlumno'
  | 'titulo'
  | 'titulo_en_tramite'
  | 'egreso'
  // profesor
  | 'luProfesor'
  | 'idProfesor'
  // cursa
  | 'luAlumnoCursa'
  | 'codigoMateriaCursa'
  | 'cuatrimestreCursa'
  | 'nota'
  // dicta
  | 'luProfesorDicta'
  | 'codigoMateriaDicta'
  | 'cuatrimestreDicta'
  // materias
  | 'codigoMateria'
  | 'nombreMateria'
  // encuestaAAlumno
  | 'luUsuarioEncuestado'
  | 'luAlumnoEvaluado'
  | 'codigoMateriaEncuestaAlumno'
  | 'cuatrimestreEncuestaAlumno'
  | 'respuesta1EncuestaAlumno'
  | 'respuesta2EncuestaAlumno'
  | 'respuesta3EncuestaAlumno'
  | 'respuesta4EncuestaAlumno'
  | 'respuesta5EncuestaAlumno'
  | 'comentarioEncuestaAlumno'
  // encuestaAMateria
  | 'codigoMateriaEncuestada'
  | 'cuatrimestreEncuestaMateria'
  | 'respuesta1EncuestaMateria'
  | 'respuesta2EncuestaMateria'
  | 'respuesta3EncuestaMateria'
  | 'respuesta4EncuestaMateria'
  | 'respuesta5EncuestaMateria'
  | 'respuesta6EncuestaMateria'
  | 'respuesta7EncuestaMateria'
  | 'respuesta8EncuestaMateria'
  | 'respuesta9EncuestaMateria'
  | 'respuesta10EncuestaMateria'
  | 'respuesta11EncuestaMateria'
  | 'respuesta12EncuestaMateria'
  | 'respuesta13EncuestaMateria'
  | 'respuesta14EncuestaMateria'
  | 'respuesta15EncuestaMateria'
  | 'comentarioEncuestaMateria'
  // encuestaAProfesor
  | 'luAlumnoEncuestado'
  | 'codigoMateriaEncuestaProfesor'
  | 'cuatrimestreEncuestaProfesor'
  | 'respuesta1EncuestaProfesor'
  | 'respuesta2EncuestaProfesor'
  | 'respuesta3EncuestaProfesor'
  | 'respuesta4EncuestaProfesor'
  | 'respuesta5EncuestaProfesor'
  | 'respuesta6EncuestaProfesor'
  | 'respuesta7EncuestaProfesor'
  | 'respuesta8EncuestaProfesor'
  | 'respuesta9EncuestaProfesor'
  | 'respuesta10EncuestaProfesor'
  | 'respuesta11EncuestaProfesor'
  | 'respuesta12EncuestaProfesor'
  | 'comentario'
  // usuarios
  | 'idUsuario'
  | 'username'
  | 'password_hash'
  | 'apellidoUsuario'
  | 'nombresUsuario'
  | 'email'
  | 'activo'
  | 'luUsuario';

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
      { name: 'luEntidad', type: 'text', title: 'Lu' },
      { name: 'apellidoEntidad', type: 'text', title: 'Apellido' },
      { name: 'nombresEntidad', type: 'text', title: 'Nombres' },
    ],
    pk: ['luEntidad'],
    fks: [],
    elementName: 'entidadUniversitaria',
    orderBy: ['apellidoEntidad', 'nombresEntidad'],
    requiereRuta: false
  },

  {
    name: 'alumnos',
    columns: [
      { name: 'luAlumno', type: 'text', title: 'Lu' },
      { name: 'titulo', type: 'text', title: 'Titulo' },
      { name: 'titulo_en_tramite', type: 'boolean', title: 'Titulo En Tramite' },
      { name: 'egreso', type: 'date', title: 'Egreso' },
    ],
    pk: ['luAlumno'],
    fks: [
      {
        column: 'luAlumno',
        referencedColumn: 'luEntidad',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['luEntidad']
      }
    ],
    elementName: 'alumno',
    orderBy: ['luAlumno'],
    requiereRuta: true 
  },

  {
    name: 'profesor',
    columns: [
      { name: 'idProfesor', type: 'serial', title: 'Id' },
      { name: 'luProfesor', type: 'text', title: 'Lu' },
    ],
    pk: ['idProfesor'],
    fks: [
      {
        column: 'luProfesor',
        referencedColumn: 'luEntidad',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['luEntidad']
      }
    ],
    elementName: 'profesor',
    orderBy: ['idProfesor'],
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
    name: 'cursa',
    columns: [
      { name: 'luAlumnoCursa', type: 'text', title: 'LuAlumnoCursa' },
      { name: 'codigoMateriaCursa', type: 'text', title: 'CodigoMateriaCursa' },
      { name: 'cuatrimestreCursa', type: 'text', title: 'CuatrimestreCursa' },
      { name: 'nota', type: 'numeric', title: 'Nota' },
    ],
    pk: ['luAlumnoCursa', 'codigoMateriaCursa', 'cuatrimestreCursa'],
    fks: [
      {
        column: 'luAlumnoCursa',
        referencedColumn: 'luAlumno',
        referencesTable: 'alumnos',
        referencesColumns: ['luAlumno']
      },
      {
        column: 'codigoMateriaCursa',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'cursa',
    orderBy: ['luAlumnoCursa', 'codigoMateriaCursa', 'cuatrimestreCursa'],
    requiereRuta: true 
  },

  {
    name: 'dicta',
    columns: [
      { name: 'luProfesorDicta', type: 'text', title: 'LuProfesorDicta' },
      { name: 'codigoMateriaDicta', type: 'text', title: 'CodigoMateriaDicta' },
      { name: 'cuatrimestreDicta', type: 'text', title: 'CuatrimestreDicta' },
    ],
    pk: ['luProfesorDicta', 'codigoMateriaDicta', 'cuatrimestreDicta'],
    fks: [
      {
        column: 'luProfesorDicta',
        referencedColumn: 'luProfesor',
        referencesTable: 'profesor',
        referencesColumns: ['luProfesor']
      },
      {
        column: 'codigoMateriaDicta',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'dicta',
    orderBy: ['codigoMateriaDicta', 'cuatrimestreDicta', 'luProfesorDicta'],
    requiereRuta: false 
  },

  {
    name: 'encuestaAAlumno',
    columns: [
      { name: 'luUsuarioEncuestado', type: 'text', title: 'LuUsuarioEncuestado' },
      { name: 'luAlumnoEvaluado', type: 'text', title: 'Lu' },
      { name: 'codigoMateriaEncuestaAlumno', type: 'text', title: 'Codigo Materia' },
      { name: 'cuatrimestreEncuestaAlumno', type: 'text', title: 'Cuatrimestre' },
      { name: 'respuesta1EncuestaAlumno', type: 'integer', title: 'Respuesta1' },
      { name: 'respuesta2EncuestaAlumno', type: 'integer', title: 'Respuesta2' },
      { name: 'respuesta3EncuestaAlumno', type: 'integer', title: 'Respuesta3' },
      { name: 'respuesta4EncuestaAlumno', type: 'integer', title: 'Respuesta4' },
      { name: 'respuesta5EncuestaAlumno', type: 'integer',title: 'Respuesta5' },
      { name: 'comentarioEncuestaAlumno', type: 'text', title: 'Comentario' },
    ],
    pk: [
      'luUsuarioEncuestado',
      'luAlumnoEvaluado',
      'codigoMateriaEncuestaAlumno',
      'cuatrimestreEncuestaAlumno'
    ],
    fks: [
      {
        column: 'luUsuarioEncuestado',
        referencedColumn: 'luUsuario',
        referencesTable: 'usuarios',
        referencesColumns: ['luUsuario']
      },
      {
        column: 'luAlumnoEvaluado',
        referencedColumn: 'luAlumno',
        referencesTable: 'alumnos',
        referencesColumns: ['luAlumno']
      },
      {
        column: 'codigoMateriaEncuestaAlumno',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'Encuesta a alumno',
    orderBy: ['codigoMateriaEncuestaAlumno', 'cuatrimestreEncuestaAlumno', 'luAlumnoEvaluado'],
    requiereRuta: true
  },

  {
    name: 'encuestaAMateria',
    columns: [
      { name: 'codigoMateriaEncuestada', type: 'text', title: 'Codigo Materia' },
      { name: 'cuatrimestreEncuestaMateria', type: 'text', title: 'Cuatrimestre' },
      { name: 'respuesta1EncuestaMateria', type: 'integer', title: 'Respuesta1' },
      { name: 'respuesta2EncuestaMateria', type: 'integer', title: 'Respuesta2' },
      { name: 'respuesta3EncuestaMateria', type: 'integer', title: 'Respuesta3' },
      { name: 'respuesta4EncuestaMateria', type: 'integer', title: 'Respuesta4' },
      { name: 'respuesta5EncuestaMateria', type: 'integer', title: 'Respuesta5' },
      { name: 'respuesta6EncuestaMateria', type: 'integer', title: 'Respuesta6' },
      { name: 'respuesta7EncuestaMateria', type: 'integer', title: 'Respuesta7' },
      { name: 'respuesta8EncuestaMateria', type: 'integer', title: 'Respuesta8' },
      { name: 'respuesta9EncuestaMateria', type: 'integer', title: 'Respuesta9' },
      { name: 'respuesta10EncuestaMateria', type: 'integer', title: 'Respuesta10' },
      { name: 'respuesta11EncuestaMateria', type: 'integer', title: 'Respuesta11' },
      { name: 'respuesta12EncuestaMateria', type: 'integer', title: 'Respuesta12' },
      { name: 'respuesta13EncuestaMateria', type: 'integer', title: 'Respuesta13' },
      { name: 'respuesta14EncuestaMateria', type: 'integer', title: 'Respuesta14' },
      { name: 'respuesta15EncuestaMateria', type: 'integer', title: 'Respuesta15' },
      { name: 'comentarioEncuestaMateria', type: 'text', title: 'Comentario' },
    ],
    pk: ['codigoMateriaEncuestada', 'cuatrimestreEncuestaMateria'],
    fks: [
      {
        column: 'codigoMateriaEncuestada',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'Encuesta a materia',
    orderBy: ['codigoMateriaEncuestada', 'cuatrimestreEncuestaMateria'],
    requiereRuta: true 
  },

  {
    name: 'encuestaAProfesor',
    columns: [
      { name: 'luAlumnoEncuestado', type: 'text', title: 'LuAlumnoEncuestado' },
      { name: 'codigoMateriaEncuestaProfesor', type: 'text', title: 'Codigo Materia' },
      { name: 'cuatrimestreEncuestaProfesor', type: 'text', title: 'Cuatrimestre' },
      { name: 'respuesta1EncuestaProfesor', type: 'integer', title: 'Respuesta1' },
      { name: 'respuesta2EncuestaProfesor', type: 'integer', title: 'Respuesta2' },
      { name: 'respuesta3EncuestaProfesor', type: 'integer', title: 'Respuesta3' },
      { name: 'respuesta4EncuestaProfesor', type: 'integer', title: 'Respuesta4' },
      { name: 'respuesta5EncuestaProfesor', type: 'integer', title: 'Respuesta5' },
      { name: 'respuesta6EncuestaProfesor', type: 'integer', title: 'Respuesta6' },
      { name: 'respuesta7EncuestaProfesor', type: 'integer', title: 'Respuesta7' },
      { name: 'respuesta8EncuestaProfesor', type: 'integer', title: 'Respuesta8' },
      { name: 'respuesta9EncuestaProfesor', type: 'integer', title: 'Respuesta9' },
      { name: 'respuesta10EncuestaProfesor', type: 'integer', title: 'Respuesta10' },
      { name: 'respuesta11EncuestaProfesor', type: 'integer', title: 'Respuesta11' },
      { name: 'respuesta12EncuestaProfesor', type: 'integer', title: 'Respuesta12' },
      { name: 'comentario', type: 'text', title: 'Comentario' },
    ],
    pk: [
      'luAlumnoEncuestado',
      'codigoMateriaEncuestaProfesor',
      'cuatrimestreEncuestaProfesor'
    ],
    fks: [
      {
        column: 'luAlumnoEncuestado',
        referencedColumn: 'luAlumno',
        referencesTable: 'alumnos',
        referencesColumns: ['luAlumno']
      },
      {
        column: 'codigoMateriaEncuestaProfesor',
        referencedColumn: 'codigoMateria',
        referencesTable: 'materias',
        referencesColumns: ['codigoMateria']
      }
    ],
    elementName: 'Encuesta a profesor',
    orderBy: ['codigoMateriaEncuestaProfesor', 'cuatrimestreEncuestaProfesor', 'luAlumnoEncuestado'],
    requiereRuta: true 
  },

  {
    name: 'usuarios',
    columns: [
      { name: 'idUsuario', type: 'serial', title: 'IdUsuario' },
      { name: 'username', type: 'text', title: 'Username' },
      { name: 'password_hash', type: 'text', title: 'Password_hash' },
      { name: 'apellidoUsuario', type: 'text', title: 'Apellido' },
      { name: 'nombresUsuario', type: 'text', title: 'Nombres' },
      { name: 'email', type: 'text', title: 'Email' },
      { name: 'activo', type: 'boolean', title: 'Activo' },
      { name: 'luUsuario', type: 'text', title: 'Lu' },
    ],
    pk: ['idUsuario'],
    fks: [
      {
        column: 'luUsuario',
        referencedColumn: 'luEntidad',
        referencesTable: 'entidadUniversitaria',
        referencesColumns: ['luEntidad']
      }
    ],
    elementName: 'Usuario',
    orderBy: ['apellidoUsuario', 'nombresUsuario'],
    requiereRuta: false 
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

export const tableDefs = completeTableDefaults(tableDefinitions)