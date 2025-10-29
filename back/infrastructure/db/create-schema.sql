set role to aida_owner;
create schema aida;
-- Le damos permiso de ver y usar los objetos dentro del esquema pero no permite modificarlos ni crear nuevos.
grant usage on schema aida to aida_admin;

create table aida.alumnos (
    lu text primary key,
    apellido text not null,
    nombres text not null,
    titulo text,
    titulo_en_tramite date,
    egreso date
);

-- Habria que hacer que el id sea el LU y que en el front ingreses eso
CREATE TABLE aida.usuarios (
    id serial primary key,
    username text not null unique,
    password_hash text not null,
    nombre text not null, 
    email text not null unique,
	esProfesor bool not null,
	esAlumno bool not null,
    activo bool not null default true
);

-- Creacion tablas encuesta 
CREATE TABLE aida.materias (
    codigoMateria VARCHAR primary key, 
    nombreMateria VARCHAR not null
)

CREATE TABLE aida.dicta(
    luProfesor VARCHAR foreign key, 
    codigoMateria VARCHAR foreign key,
    cuatrimestre VARCHAR primary key 
)

CREATE TABLE aida.cursa(
    luAlumno VARCHAR foreign key, 
    codigoMateria VARCHAR foreign key,
    cuatrimestre VARCHAR primary key 
)

CREATE TABLE aida.encuestaAProfesor(
    luEncuestado VARCHAR foreign key, 
    luEvaluado VARCHAR foreign key, 
    codigoMateria VARCHAR foreign key, 
    cuatrimestre VARCHAR primary key, 
    respuesta1 number,
    respuesta2 number,
    respuesta3 number,
    respuesta4 number,
    respuesta5 number,
    respuesta6 number,
    respuesta7 number,
    respuesta8 number,
    respuesta9 number,
    respuesta10 number,
    respuesta11 number,
    respuesta12 number,
    comentario VARCHAR
)

CREATE TABLE aida.encuestaAMateria(
    luEncuestado VARCHAR foreign key,
    codigoMateria VARCHAR foreign key,
    cuatrimestre VARCHAR primary key,
    respuesta1 number,
    respuesta2 number,
    respuesta3 number,
    respuesta4 number,
    respuesta5 number,
    respuesta6 number,
    respuesta7 number,
    respuesta8 number,
    respuesta9 number,
    respuesta10 number,
    respuesta11 number,
    respuesta12 number,
    respuesta13 number,
    respuesta14 number,
    respuesta15 number,
    respuesta16 number,
    comentario VARCHAR
)

CREATE TABLE aida.encuestaAAlumno(
    luEncuestado VARCHAR foreign key, 
    luEvaluado VARCHAR foreign key, 
    codigoMateria VARCHAR foreign key, 
    cuatrimestre VARCHAR primary key, 
    respuesta1 number,
    respuesta2 number,
    respuesta3 number,
    respuesta4 number,
    respuesta5 number,
    comentario VARCHAR
)

-- Le damos permiso a aida admin sobre los datos de la tabla sin poder borrar la tabla o agregar nuevas
grant select, insert, update, delete on aida.alumnos to aida_admin;