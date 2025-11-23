# AIDA App - Backend

Indicaciones como crear base local

## Variables de Entorno

El backend requiere las siguientes variables de entorno para funcionar correctamente. Crea un archivo `local-sets.env` en la raíz del proyecto `back/` con las variables:

`PRODUCTION_DB`: Indica si se usa la base de datos local de desarrollo o la de producción, en nuestro caso subida a supabase.

`CONNECTION_STRING_DB`: String de conexión a la DB. Si se usa Supabase para conseguir el connection string hay que ir al proyecto de supabase, tocar connect, elegir transaction pooler y copiar el connection string. 
