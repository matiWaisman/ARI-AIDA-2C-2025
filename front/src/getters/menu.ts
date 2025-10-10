import type { Request, Response } from 'express';

// En este archivo estan todas las funciones que se llaman para armar el menu. Devuelven el html del menu.

// HTML del menú principal
const HTML_MENU = `<!doctype html>
<html>
    <head>
        <meta charset="utf8">
    </head>
    <body>
        <h1>AIDA</h1>
        <p>menu</p>
        <p><a href="/app/lu">Imprimir certificado por LU</a></p>
        <p><a href="/app/fecha">Imprimir certificado por fecha de trámite</a></p>
        <p><a href="/app/archivo">Subir .csv con novedades de alumnos</a></p>
        <p><a href="/ask?p=np">¿Es P = NP?</a></p>
    </body>
</html>`;

// Función para mostrar el menú principal
export function getMenu(req: Request, res: Response): void {
    res.send(HTML_MENU);
}
