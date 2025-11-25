## Arquitectura de AIDA
En este proyecto intentamos seguir una arquitectura en capas, la idea detrás de esto es separar el código en módulos de responsabilidades, facilitando el mantenimiento y la escalabilidad.
En este caso en particular lo separamos en 3 capas:

- Business:
  En el business es donde vive la lógica del negocio, tiene que ser agnóstico tanto a la infraestructura como a la aplicación (mencionadas más adelante). Al ser una arquitectura en capas el business conoce a los repositorios, pero no sabe qué base de datos se usa: simplemente los utiliza como los que tienen la información. Esto nos permite el día de mañana poder rediseñar la base en otro lenguaje sin tener que tocar código del business, ya que solamente contiene la lógica y le manda mensajes al repo para que luego el business aplique las reglas/leyes necesarias sobre los objetos/datos. En el caso de esta arquitectura particular no utilizamos objetos, sino que trabajamos directamente sobre los JSON que se obtienen de la base; sin embargo, contamos con las entidades que vendrían a ser el "tipo" de los objetos JSON.

- Infrastructure:

  - En la infraestructura es donde viven los repositorios, separados por responsabilidad/entidad y la base de datos. Al no contener lógica de negocio en los repos, podemos modularizarlos y facilitar la búsqueda/reparación de operaciones. También opera como interfaz entre la base de datos y el business, ya que mantiene la lógica de SQL fuera de nuestra abstracción del dominio. Vale ver además que esta capa es la que no conoce a ninguna otra: solamente se comunica con la base de datos mediante las queries, mientras que el Business conoce al Repository y la Application conoce al Business.
  - También caen bajo esta ala, pero en menor importancia, los métodos de lectura y parseo de CSV's. Dentro de las 3 capas se decidió que caigan sobre esta porque no tienen que ver con la aplicación en sí (no tienen nada que ver con la comunicación de la app con el exterior) ni tienen que ver con el business (un sistema de gestión de alumnos no tiene nada que ver con el parseo/lectura de CSV's).

- Application:
  Esta capa es la encargada de comunicar la app con el mundo exterior, entre sus responsabilidades se hallan:
  Controllers: Operan como interfaz entre la request y el business, crean el Client para la base de datos, llaman al método del business pertinente y a la response le agregan los códigos de éxito o error. Cumplen la función de extraer esta lógica de la aplicación del business y permitir utilizar códigos o mensajes personalizados por método o entidad.
  Routes: Exponen las rutas junto a su mensaje del controlador pertinente, "mapean" el path al que se llama desde el front con el mensaje del controller del back.
  Server/App: Inicialización del server Express y middlewares.

Ejemplo de un flujo de ejecución:
Llega una request a /xxx/yyy.
La Application revisa que efectivamente el usuario que hizo esa pegada tenga credenciales.
Hace "pattern matching" entre sus routes para ver a qué Controller le corresponde manejar la request.
El controller correspondiente recibe la request, levanta al Client de la DB, obtiene los datos de la request y los envía al método del business correspondiente.
El método se ejecuta aplicando lógica del dominio sobre esos datos.
Este persiste/modifica datos del repository correspondiente.
El método del Repositorio arma la query para la base de datos.
Se persiste/modifica el dato en la base.
El repositorio devuelve el dato persistido/modificado.
El business devuelve este dato o lo interpreta para aplicar reglas de negocio.
Al controller le llega el resultado del método del Business, y a partir de este arma la Response según si fue exitoso o no.
La App envía la respuesta devuelta al front.

## VARIABLES DE ENTORNO:

El backend requiere las siguientes variables de entorno para funcionar correctamente. Creá un archivo `local-sets.env` en la raíz del proyecto `back/` con las variables:

- `PGUSER`= Usuario de la base de datos PostgreSQL
- `PGPASSWORD`= Contraseña del usuario de PostgreSQL
- `PGHOST`= Host donde corre PostgreSQL (ej: localhost)
- `PGPORT`= Puerto de PostgreSQL (ej: 5432)
- `PGDATABASE`= Nombre de la base de datos a utilizar
- `REQUIRE_LOGIN`= Si es 'true', obliga a iniciar sesión antes de usar la app

## CÓMO LEVANTAR EL PROYECTO LOCALMENTE:

Para la siguiente secuencia de pasos se asume que ya se forkéo el proyecto y se tiene descargado localmente.

- Correr desde la terminal, ubicándose en la carpeta del proyecto (`ARI-AIDA-2C-2025`), el siguiente comando: `npm run install`.
  Esto va a descargar todas las dependencias y requisitos necesarios del proyecto.
- Correr desde la terminal el siguiente comando: `cd back/`.
- Correr desde la terminal el siguiente comando: `npm run db:init`.
  Esto inicializa la base de datos y va a pedir la contraseña definida en el `.env`.
- Correr desde la terminal el siguiente comando: `cd ..`.
- Correr desde la terminal el siguiente comando: `npm run start`.
  Si todo se instaló correctamente, deberías poder acceder a la página localmente desde `localhost:8080` y al backend desde `localhost:3000`.

## Cómo ejecutar solo el backend 

Si querés correr únicamente el backend sin levantar todo el proyecto:

- Desarrollo:
  - Ubicate en la carpeta `/back`.
  - Instalá las dependencias con `npm install`
  - Levantá el servidor en modo desarrollo con `npm run dev`

- Producción:
  - Ubicate en la carpeta `/back`.
  - Instalá las dependencias con `npm install`.
  - Levantá el servidor en modo producción con `npm start`

El script `npm start` setea `NODE_ENV=production` y arranca el `src/app.ts`.
