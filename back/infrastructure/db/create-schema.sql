set role to aida_owner;
create schema aida;
grant usage on schema aida to aida_admin;

CREATE TABLE aida.entidadUniversitaria (
luEntidad TEXT PRIMARY KEY,
apellidoEntidad TEXT NOT NULL,
nombresEntidad TEXT NOT NULL
);

CREATE TABLE aida.alumnos (
luAlumno TEXT PRIMARY KEY REFERENCES aida.entidadUniversitaria(luEntidad),
titulo TEXT,
titulo_en_tramite DATE,
egreso DATE
);

CREATE TABLE aida.usuarios (
idUsuario SERIAL PRIMARY KEY,
username TEXT NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
apellidoUsuario TEXT NOT NULL,
nombresUsuario TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
activo BOOL NOT NULL DEFAULT TRUE,
luUsuario TEXT REFERENCES aida.entidadUniversitaria(luEntidad)
);

CREATE TABLE aida.profesor (
luProfesor TEXT PRIMARY KEY REFERENCES aida.entidadUniversitaria(luEntidad),
idProfesor INTEGER REFERENCES aida.usuarios(idUsuario)
);

CREATE TABLE aida.materias (
codigoMateria VARCHAR PRIMARY KEY,
nombreMateria VARCHAR NOT NULL
);

CREATE TABLE aida.dicta (
luProfesorDicta TEXT REFERENCES aida.profesor(luProfesor),
codigoMateriaDicta VARCHAR REFERENCES aida.materias(codigoMateria),
cuatrimestreDicta VARCHAR,
PRIMARY KEY (luProfesorDicta, codigoMateriaDicta, cuatrimestreDicta)
);

CREATE TABLE aida.cursa (
luAlumnoCursa TEXT REFERENCES aida.alumnos(luAlumno),
codigoMateriaCursa VARCHAR REFERENCES aida.materias(codigoMateria),
cuatrimestreCursa VARCHAR,
nota NUMERIC,
PRIMARY KEY (luAlumnoCursa, codigoMateriaCursa, cuatrimestreCursa)
);

CREATE TABLE aida.encuestaAProfesor (
luAlumnoEncuestado TEXT REFERENCES aida.entidadUniversitaria(luEntidad),
luProfesor TEXT REFERENCES aida.entidadUniversitaria(luEntidad),
codigoMateriaEncuestaProfesor TEXT REFERENCES aida.materias(codigoMateria),
cuatrimestreEncuestaProfesor TEXT,
respuesta1EncuestaProfesor NUMERIC,
respuesta2EncuestaProfesor NUMERIC,
respuesta3EncuestaProfesor NUMERIC,
respuesta4EncuestaProfesor NUMERIC,
respuesta5EncuestaProfesor NUMERIC,
respuesta6EncuestaProfesor NUMERIC,
respuesta7EncuestaProfesor NUMERIC,
respuesta8EncuestaProfesor NUMERIC,
respuesta9EncuestaProfesor NUMERIC,
respuesta10EncuestaProfesor NUMERIC,
respuesta11EncuestaProfesor NUMERIC,
respuesta12EncuestaProfesor NUMERIC,
comentario TEXT,
PRIMARY KEY (luAlumnoEncuestado, luProfesor, codigoMateriaEncuestaProfesor, cuatrimestreEncuestaProfesor)
);

CREATE TABLE aida.encuestaAMateria (
luUsuarioEncuestado TEXT REFERENCES aida.entidadUniversitaria(luEntidad),
codigoMateriaEncuestada TEXT REFERENCES aida.materias(codigoMateria),
cuatrimestreEncuestaMateria TEXT,
respuesta1EncuestaMateria NUMERIC,
respuesta2EncuestaMateria NUMERIC,
respuesta3EncuestaMateria NUMERIC,
respuesta4EncuestaMateria NUMERIC,
respuesta5EncuestaMateria NUMERIC,
respuesta6EncuestaMateria NUMERIC,
respuesta7EncuestaMateria NUMERIC,
respuesta8EncuestaMateria NUMERIC,
respuesta9EncuestaMateria NUMERIC,
respuesta10EncuestaMateria NUMERIC,
respuesta11EncuestaMateria NUMERIC,
respuesta12EncuestaMateria NUMERIC,
respuesta13EncuestaMateria NUMERIC,
respuesta14EncuestaMateria NUMERIC,
respuesta15EncuestaMateria NUMERIC,
respuesta16EncuestaMateria NUMERIC,
comentarioEncuestaMateria TEXT,
PRIMARY KEY (luUsuarioEncuestado, codigoMateriaEncuestada, cuatrimestreEncuestaMateria)
);

CREATE TABLE aida.encuestaAAlumno (
luUsuarioEncuestado TEXT REFERENCES aida.entidadUniversitaria(luEntidad),
luAlumnoEvaluado TEXT REFERENCES aida.entidadUniversitaria(luEntidad),
codigoMateriaEncuestaAlumno TEXT REFERENCES aida.materias(codigoMateria),
cuatrimestreEncuestaAlumno TEXT,
respuesta1EncuestaAlumno NUMERIC,
respuesta2EncuestaAlumno NUMERIC,
respuesta3EncuestaAlumno NUMERIC,
respuesta4EncuestaAlumno NUMERIC,
respuesta5EncuestaAlumno NUMERIC,
comentarioEncuestaAlumno TEXT,
PRIMARY KEY (luUsuarioEncuestado, luAlumnoEvaluado, codigoMateriaEncuestaAlumno, cuatrimestreEncuestaAlumno)
);

grant select, insert, update, delete on all tables in schema aida to aida_admin;

INSERT INTO aida.entidadUniversitaria (luEntidad, apellidoEntidad, nombresEntidad)
VALUES ('25/18', 'Bocaccio', 'Sebastian');

INSERT INTO aida.usuarios (username, password_hash, apellidoUsuario, nombresUsuario, email, luUsuario)
VALUES ('sbocaccio', 'hash123', 'Bocaccio', 'Sebastian', 'sebastian@uni.edu', '25/18');

INSERT INTO aida.profesor (luProfesor, idProfesor)
SELECT '25/18', idUsuario
FROM aida.usuarios
WHERE username = 'sbocaccio';

INSERT INTO aida.materias (codigoMateria, nombreMateria)
VALUES ('BD101', 'Bases de Datos');

INSERT INTO aida.dicta (luProfesorDicta, codigoMateriaDicta, cuatrimestreDicta)
VALUES ('25/18', 'BD101', '2C2025');

INSERT INTO aida.entidadUniversitaria (luEntidad, apellidoEntidad, nombresEntidad)
VALUES ('30/22', 'García', 'Lucía');

INSERT INTO aida.alumnos (luAlumno, titulo, titulo_en_tramite, egreso)
VALUES ('30/22', NULL, NULL, NULL);

INSERT INTO aida.cursa (luAlumnoCursa, codigoMateriaCursa, cuatrimestreCursa, nota)
VALUES ('30/22', 'BD101', '2C2025', NULL);

SELECT m.nombreMateria, m.codigoMateria, e.nombresEntidad, e.apellidoEntidad, d.cuatrimestreDicta
FROM aida.materias m 
INNER JOIN aida.dicta d ON m.codigoMateria = d.codigoMateriaDicta
INNER JOIN aida.profesor p ON d.luProfesorDicta = p.luProfesor
INNER JOIN aida.entidadUniversitaria e ON p.luProfesor = e.luEntidad;
