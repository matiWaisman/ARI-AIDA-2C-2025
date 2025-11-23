Indicaciones como crear base local

Para usar la base de producción crear archivo local-sets.env en la carpeta root del back y agregar: 

```
PRODUCTION_DB=true
CONNECTION_STRING_DB=[TU_CONNECTION_STRING]
```
Si se quiere usar la base de desarrollo poner PRODUCTION_DB como cualquier cosa distinta a true. 

Para conseguir el connection string hay que ir al proyecto de supabase, tocar connect, elegir transaction pooler y copiar el connection string. 