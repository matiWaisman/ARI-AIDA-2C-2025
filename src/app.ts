import http, { IncomingMessage, ServerResponse } from 'node:http';
import { Client } from 'pg'
import { readCsv } from './utils/read-csv.ts';

const hostname: string = '127.0.0.1';
const port: number = 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => { // EL create server recibe una callback function que se ejecuta cada vez que llega una request
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => { // Server listen recibe los dos argumentos y una callback function que se ejecuta cuando se hace listen por primera vez
  console.log(`Server running at http://${hostname}:${port}/`);
});
