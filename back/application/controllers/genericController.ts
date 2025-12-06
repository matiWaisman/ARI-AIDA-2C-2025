import type { Request, Response } from 'express';
import type { ColumnName, ForeignKeyDef, TableDef, TableName} from '../../src/tableDefs.js';
import { tableDefs } from '../../src/tableDefs.js';
import { createDbClient } from "../../infrastructure/db/db-client.js";

export function genericController(tableDef: TableDef){

    const tableName = 'aida.'+tableDef.name;
    const allColnames = tableDef.columns.map(def => def.name);
    const {pk} = tableDef;
    const {fks} = tableDef;
    const orderBy = tableDef.orderBy ?? pk
    const elementName = tableDef.elementName ?? 'registro de ' + tableDef.name
    const pkDolarCondition = (startingOn:number) => pk.map((colname,i) => `${colname} = \$${i+startingOn}`).join(' AND ')
    const pkParams = (params:Record<string, any>) => pk.map(colname => params[colname])
    const allParams = (params:Record<string, any>) => allColnames.map(colname => params[colname])
    const allTableDefs = tableDefs;

    const createRecord2 = async (req: Request, res: Response): Promise<void> => {
      console.log("Insertando alumno...");
        const client = createDbClient();
        await client.connect();
        const result = await client.query(
          `INSERT INTO ${tableName} (${allColnames}) VALUES (${allColnames.map((_,i)=>`\$${i+1}`)}) RETURNING *`,
          allParams(req.body)
        );
            
        res.status(201).json(result.rows[0]);
        await client.end();
        console.log("Insertado alumno:", result.rows[0]);
    }
    return { createRecord2  }
}