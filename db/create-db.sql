create user aida_owner nologin; 
-- Va a ser el dueño de la db, tiene control completo de la db. 
-- Puede crear tablas, esquemas, modificar los roles de un usuario. 
create user aida_admin password 'aguante_atlanta';

create database aida_db owner aida_owner;
grant connect on database aida_db to aida_admin; -- Permite que el admin se pueda conectar a la db
-- Aida admin solo va a poder hacer consultas o agregar datos, no va a poder crear tablas o eliminarlas

