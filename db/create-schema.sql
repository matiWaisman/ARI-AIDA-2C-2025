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

-- Le damos permiso a aida admin sobre los datos de la tabla sin poder borrar la tabla o agregar nuevas
grant select, insert, update, delete on aida.alumnos to aida_admin;