# AIDA App - Frontend

Para ejecutar la aplicación primero instalá las dependencias con `npm i`. Después, según si estás desarrollando o corriendo en producción, podés usar distintos comandos.

El front está separado en:

- `/public` tiene cosas del setup de Next, como el gran icono de la página.
- `/types` tiene definidos algunos tipos que usamos dentro del front.
- `/.next` tiene archivos y configuraciones internas de Next que no tocamos.
- `/apiClient` tiene el archivo `apiClient.ts`. Nos sirve para configurar una única vez cómo le pegamos al backend, como la sesión, y que en el resto de los lugares solo haya que pasarle el path y las opciones específicas de cada request.
- En `/app/pagina` está, para cada ruta, su página correspondiente. Un beneficio de usar Next es que no nos tenemos que preocupar por setear las rutas: Next se encarga solo a partir de las carpetas y archivos que creemos. En las páginas que se separan en `page.tsx` y `XClient.tsx`, el `page.tsx` hace de “entrypoint” y se ejecuta del lado del servidor, y el `XClient.tsx` es el componente que corre en el cliente y puede usar cosas como `useState`, `useEffect`, etc.
- `components` tiene algunos componentes que reutilizamos en el front. Los que están en la carpeta root se usan en varios lados, y los que están en subcarpetas suelen usarse solo en las páginas relacionadas con esa carpeta.
- En `/contexts` está el único `useContext` que definimos, que tiene los datos del usuario que está logueado. Sirve para poder obtener datos como su nombre o sus roles en cualquier lugar de la página.
- En `/features` hay pedazos de funcionalidad concreta que se usan en algunos componentes o páginas, como por ejemplo la lógica del login o de completar las encuestas.

## Variables de Entorno

El frontend requiere las siguientes variables de entorno para funcionar correctamente. Creá un archivo `local-sets.env` en la raíz del proyecto `aida-app/` con las variables:

- `API_BASE`: URL del backend.  
  Si no se define esta variable, el frontend va a usar `http://localhost:3000/app` por defecto.

## Cómo ejecutar solo el frontend:

Si querés correr únicamente el frontend sin levantar todo el proyecto:

- **Desarrollo:**
  - Ubicate en la carpeta `/aida-app`.
  - Instalá las dependencias con `npm install`.
  - Levantá el servidor de desarrollo de Next con `npm run dev`.

- **Producción:**
  - Ubicate en la carpeta `/aida-app`.
  - Instalá las dependencias con `npm install`.
  - Generá el build optimizado con `npm run build`.
  - Levantá el servidor de Next en modo producción con `npm start`.
