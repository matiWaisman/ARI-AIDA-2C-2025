Arquitectura de AIDA
En este proyecto intentamos seguir una arquitectura en capas, la idea detras de esto es separar el codigo en modulos de responsabilidades, facilitando el mantenimiento y la escabilidad
En este caso en particular lo separamos en 3 capas

Business:
En el business es donde vive la logica del negocio, tiene que ser agnostico tanto a la infraestructura como a la aplicacion (mencionadas mas adelante), al ser una arquitectura en capas el business conoce a los repositorios pero no sabe que base de datos se usa, simplemente los utiliza como los que tienen la informacion, esto nos permite el dia de maniana poder rediseniar la base en otro lenguaje sin tener que tocar codigo del business, ya que solamente contiene la logica y le manda mensajes al repo para que luego el business aplique las reglas/leyes necesarias sobre los objetos/datos. En el caso de esta arquitectura particular no utilizamos objetos, sino que trabajamos directamente sobre los JSON que se obtienen de la Base, sin embargo contamos con las entidades que vendrian a ser el "tipo" de los objetos json.

Infrastructure:
En la infraestructura es donde viven los repositorios, separados por responsabilidad/entidad y la base de datos, al no contener logica de negocio en los repos podemos modularizarlos y facilitar la busqueda/reparacion de operaciones. Tambien opera como interfaz entre la base de datos y el business ya que mantiene la logica de sql fuera de nuestra abstraccion del dominio. Vale ver ademas que esta capa es la que no conoce a ninguna otra, solamente se comunica con la base de datos mediante las queries, mientras que el Business conoce al Repository y la Application conoce al Business.
Tambien caen bajo esta ala pero en menor importancia los metodos de lectura y parseo de CSV's. Dentro de las 3 capas se decidio que caigan sobre esta porque no tienen que ver con la aplicacion en si (no tienen nada que ver con la comunicacion de la app con el exterior) ni tienen que ver con el business (un sistema de gestion de alumnos no tiene nada que ver con el parseo/lectura de CSV's)

Application: 
Esta capa es la encargada de comunicar la app con el mundo exterior, entre sus responsabilidades se hayan:
Controllers: Operan como interfaz entre la request y el business, crean el Client para la base de datos, llaman al metodo del business pertinente y a la response le agregan los codigos de Exito o Error. Cumplen la funcion de extraer esta logica de la aplicacion del business y permitir utilizar codigos o mensajes personalizados por metodo o entidad.   
Routes: Exponen las rutas junto a su mensaje del controlador pertinente, "mapean" el path al que se llama desde el front con el mensaje del controller del back
Server/App: Inicializacion del server express y middlewares

Ejemplo de un flujo de ejecucion:
Llega una request a /xxx/yyy.
La application revisa que efectivamente el usuario que hizo esa pegada este tenga credenciales.
Hace "pattern matching" entre sus routes para ver a que Controller le corresponde manejar la request.
El controller correspondiente recibe la request, levanta al Client de la DB, obteniene los datos de la request y los envia al metodo del business correspondiente.
El metodo se ejecuta aplicando logica del dominio sobre esos datos.
Este persiste/modifica datos del repository correspondiente.
El metodo del Repositorio arma la query para la Base de Datos.
Se persiste/modifica el dato en la Base.
El repositorio devuelve el dato persistido/modificado.
El business devuelve este dato o lo interpreta para aplicar reglas de negocio.
Al controller le llega el resultado del metodo del Business, a partir de este arma la Response segun si fue exitoso o no.
La App envia la respuesta devuelta al front.

VARIABLES DE ENTORNO:
El backend requiere las siguientes variables de entorno para funcionar correctamente. Crea un archivo `local-sets.env` en la raíz del proyecto `back/` con las variables:

PGUSER= Usuario de la base de datos PostgreSQL
PGPASSWORD= Password del usuario de PostgreSQL
PGHOST= Host donde corre PostgreSQL (ej: localhost)
PGPORT= Puerto de PostgreSQL (ej: 5432)
PGDATABASE= Nombre de la base de datos a utilizar
REQUIRE_LOGIN= Si es 'true', obliga a iniciar sesión antes de usar la app

COMO LEVANTAR EL PROYECTO LOCALMENTE:
Para la siguiente secuencia de pasos se asume que ya se forkeo el proyecto y se tiene descargado localmente.
-Correr desde la terminal ubicandose en la carpeta del proyecto (ARI-AIDA-2C-2025) el siguiente comando: npm run install
Esto va a descargar todas las dependencias y requisitos necesarios del proyecto.
-Correr desde la terminal el siguiente comando: cd back/
-Correr desde la terminal el siguiente comando: npm run db:init
Esto inicializa la base de datos y va a pedir la contrasenia definida en el .env
-Correr desde la terminal el siguiente comando: cd ..
-Correr desde la terminal el siguiente comando: npm run start
Si todo se instalo correctamente deberia poder acceder a la pagina localmente desde localhost:8080 y al backend desde localhost:3000
