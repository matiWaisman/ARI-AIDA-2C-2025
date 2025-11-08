set role to aida_owner;
create schema aida;
grant usage on schema aida to aida_admin;

-- Create base entity first
CREATE TABLE aida.entidadUniversitaria (
    lu TEXT PRIMARY KEY,
    apellido TEXT NOT NULL,
    nombres TEXT NOT NULL
);

-- Then create dependent tables
CREATE TABLE aida.alumnos (
    lu TEXT PRIMARY KEY REFERENCES aida.entidadUniversitaria(lu),
    titulo text,
    titulo_en_tramite date,
    egreso date
);

CREATE TABLE aida.usuarios (
    id serial primary key,
    username text not null unique,
    password_hash text not null,
    apellido text not null,
    nombres text not null, 
    email text not null unique,
    activo bool not null default true,
    lu TEXT REFERENCES aida.entidadUniversitaria(lu)
);


CREATE TABLE aida.profesor (
    lu TEXT PRIMARY KEY REFERENCES aida.entidadUniversitaria(lu),
    id INTEGER REFERENCES aida.usuarios(id)
);

CREATE TABLE aida.materias (
    codigoMateria VARCHAR PRIMARY KEY, 
    nombreMateria VARCHAR NOT NULL
);

CREATE TABLE aida.dicta (
    luProfesor TEXT REFERENCES aida.profesor(lu), 
    codigoMateria VARCHAR REFERENCES aida.materias(codigoMateria),
    cuatrimestre VARCHAR,
    PRIMARY KEY (luProfesor, codigoMateria, cuatrimestre)
);

CREATE TABLE aida.cursa (
    luAlumno TEXT REFERENCES aida.alumnos(lu), 
    codigoMateria VARCHAR REFERENCES aida.materias(codigoMateria),
    cuatrimestre VARCHAR,
    nota NUMERIC,
    PRIMARY KEY (luAlumno, codigoMateria, cuatrimestre)
);

grant select, insert, update, delete on all tables in schema aida to aida_admin;

INSERT INTO aida.entidadUniversitaria (lu, apellido, nombres)
VALUES ('25/18', 'Bocaccio', 'Sebastian');

INSERT INTO aida.usuarios (username, password_hash, apellido, nombres, email, lu)
VALUES ('sbocaccio', 'hash123', 'Bocaccio', 'Sebastian', 'sebastian@uni.edu', '25/18');

INSERT INTO aida.profesor (lu, id)
SELECT '25/18', id
FROM aida.usuarios
WHERE username = 'sbocaccio';

INSERT INTO aida.materias (codigoMateria, nombreMateria)
VALUES ('BD101', 'Bases de Datos');

INSERT INTO aida.dicta (luProfesor, codigoMateria, cuatrimestre)
VALUES ('25/18', 'BD101', '2C-2025');

INSERT INTO aida.entidadUniversitaria (lu, apellido, nombres)
VALUES ('30/22', 'García', 'Lucía');

INSERT INTO aida.alumnos (lu, titulo, titulo_en_tramite, egreso)
VALUES ('30/22', NULL, NULL, NULL);

INSERT INTO aida.cursa (luAlumno, codigoMateria, cuatrimestre, nota)
VALUES ('30/22', 'BD101', '2C-2025', NULL);

SELECT m.nombreMateria, m.codigoMateria, e.nombres, e.apellido, d.cuatrimestre
	FROM aida.materias m 
	INNER JOIN aida.dicta d ON m.codigoMateria = d.codigoMateria 
	INNER JOIN aida.profesor p ON d.luProfesor = p.lu
	INNER JOIN aida.entidadUniversitaria e ON p.lu = e.lu
	