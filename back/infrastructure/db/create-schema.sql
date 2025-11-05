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
    nombre text not null, 
    email text not null unique,
    activo bool not null default true,
    lu TEXT REFERENCES aida.entidadUniversitaria(lu)
);

CREATE TABLE aida.profesor (
    lu TEXT PRIMARY KEY REFERENCES aida.entidadUniversitaria(lu),
    nombres text NOT NULL,
    apellido text not null,
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