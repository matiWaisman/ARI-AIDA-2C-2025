import { readCsv } from './read-csv.ts';

async function insertAlumnos(path: string): Promise<void> {
    const alumnos = await readCsv(path); // alumnos es ahora un array real

    console.log('Alumnos leídos:', alumnos);
    
    for (const alumno of alumnos) {
        console.log("a");
        console.log(alumno);
    }
}

insertAlumnos('./resources/alumnos.csv');
