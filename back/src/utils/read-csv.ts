import fs from 'fs';
import { parse } from 'csv-parse';

export async function readCsv(filePath: string): Promise<any[]> {
    const data: any[] = [];
    
    return new Promise<any[]>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(parse({ columns: true, trim: true }))
            .on('data', (row) => data.push(row))
            .on('end', () => resolve(data))
            .on('error', (err) => reject(err));
    });
}

