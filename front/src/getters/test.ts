import type { Request, Response } from 'express';

// En este archivo estan todas las funciones que se llaman para armar el endpoint de prueba. Devuelven el html del endpoint de prueba.
export function getTestEndpoint(req: Request, res: Response): void {
    var htmlResponse = '<!doctype html>\n<html>\n<head>\n<meta charset="utf8">\n</head>\n<body>';
    if (JSON.stringify(req.query).length > 2) {
        htmlResponse += '<div>Yes ' + JSON.stringify(req.query) + '</div>';
    }
    if (req.body) {
        htmlResponse += '<div>Body: ' + JSON.stringify(req.body) + '</div>';
    }
    htmlResponse += '</body></html>';
    res.send(htmlResponse);
}
