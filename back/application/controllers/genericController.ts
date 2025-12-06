import type { Request, Response } from 'express';
import type { ColumnName, ForeignKeyDef, TableDef, TableName } from '../../src/tableDefs.js';
import { tableDefs } from '../../src/tableDefs.js';
import { createDbClient } from "../../infrastructure/db/db-client.js";

export function genericController(tableDef: TableDef) {

    const tablename = 'aida.' + tableDef.name;
    const allColnames = tableDef.columns.map(def => def.name);
    const { pk } = tableDef;
    const { fks } = tableDef;
    const orderBy = tableDef.orderBy ?? pk;
    const elementName = tableDef.elementName ?? ('row de ' + tableDef.name);
    const pkDolarCondition = (startingOn:number) =>
        pk.map((col,i) => `${col} = \$${i+startingOn}`).join(' AND ');
    const pkParams = (params:Record<string, any>) => pk.map(col => params[col]);
    const allParams = (params:Record<string, any>) => allColnames.map(col => params[col]);
    const allDefs = tableDefs;

    const tableNames = new Set<TableName>([
        'entidadUniversitaria',
        'alumnos',
        'profesor',
        'cursa',
        'dicta',
        'materias',
        'encuestaAAlumno',
        'encuestaAMateria',
        'encuestaAProfesor',
        'usuarios'
    ]);

    function stripPrefixes(row: any): any {
        const clean: any = {};

        for (const key of Object.keys(row)) {
            let newKey = key;
            const idx = key.indexOf("_");

            if (idx !== -1) {
                const possibleTable = key.substring(0, idx);
                if (tableNames.has(possibleTable as TableName)) {
                    newKey = key.substring(idx + 1);
                }
            }

            if (clean[newKey] === undefined) {
                clean[newKey] = row[key];
            }
        }

        return clean;
    }

    function alias(table: string, col: string): string {
        if (table === tableDef.name) {
            return `aida.${table}.${col} AS "${col}"`;
        }
        return `aida.${table}.${col} AS "${table}_${col}"`;
    }

    function mapColumnGenerico(colname: ColumnName, tableName: TableName): {table: string, col: string}[] {
        const table = allDefs.find(t => t.name === tableName);
        if (!table) return [{ table: tableName, col: colname }];

        const fk = table.fks.find(f => f.column === colname);

        if (!fk) {
            return [{ table: table.name, col: colname }];
        }

        const refTable = allDefs.find(t => t.name === fk.referencesTable)!;

        return [
            { table: tableName, col: colname },
            ...refTable.columns.map(c => ({ table: fk.referencesTable, col: c.name }))
        ];
    }

    function recursiveJoin(fk: ForeignKeyDef, fromTable: TableName): string {
        if (!fk) return '';

        const refTable = allDefs.find(t => t.name === fk.referencesTable)!;
        let nextFk: ForeignKeyDef | undefined;

        for (const col of fk.referencesColumns) {
            nextFk = refTable.fks.find(x => x.column === col);
        }

        return (
            `JOIN aida.${fk.referencesTable} ON aida.${fromTable}.${fk.column} = aida.${fk.referencesTable}.${fk.referencedColumn} ` +
            recursiveJoin(nextFk!, fk.referencesTable)
        );
    }

    const getAllRows = async (req: Request, res: Response): Promise<void> => {
        const client = createDbClient();
        await client.connect();

        try {
            const selectFields = allColnames
                .map(col =>
                    mapColumnGenerico(col, tableDef.name)
                        .map(({ table, col }) => alias(table, col))
                )
                .flat();

            const joins = fks.map(fk => recursiveJoin(fk, tableDef.name)).join(' ');

            const tablesClause = fks.length > 0
                ? `${tablename} ${joins}`
                : tablename;

            const filters = Object.entries(req.query);
            const activeConditions: string[] = [];

            for (const [colName, colValue] of filters) {
                const exists = allDefs.some(t =>
                    t.columns.some(c => c.name === colName)
                );

                if (!exists) {
                    res.status(400).json({ error: `Columna ${colName} no es válida` });
                    return;
                }

                activeConditions.push(`"${colName}" = '${colValue}'`);
            }

            const whereClause =
                activeConditions.length > 0
                    ? `WHERE ${activeConditions.join(' AND ')}`
                    : '';

            const orderByClause =
                orderBy.map(col => `"${col}"`).join(', ');

            const sql = `
                SELECT ${selectFields.join(', ')}
                FROM ${tablesClause}
                ${whereClause}
                ORDER BY ${orderByClause}
            `;

            const { rows } = await client.query(sql);

            res.json(rows.map(stripPrefixes));

        } catch (err) {
            console.error(`Error al obtener ${tablename}:`, err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    const getRow = async (req: Request, res: Response): Promise<void> => {
        const client = createDbClient();
        await client.connect();

        try {
            const selectFields = allColnames
                .map(col =>
                    mapColumnGenerico(col, tableDef.name)
                        .map(({ table, col }) => alias(table, col))
                )
                .flat();

            let fromClause = tablename;
            if (fks.length > 0) {
                fromClause += ' ' + fks
                    .map(fk =>
                        `JOIN aida.${fk.referencesTable} 
                         ON ${tablename}.${fk.column} = aida.${fk.referencesTable}.${fk.referencedColumn}`)
                    .join(' ');
            }

            const sql = `
                SELECT ${selectFields.join(', ')}
                FROM ${fromClause}
                WHERE ${pkDolarCondition(1)}
            `;

            const result = await client.query(sql, pkParams(req.params));

            if (result.rows.length === 0) {
                res.status(404).json({ error: `${elementName} no encontrado` });
                return;
            }

            res.json(stripPrefixes(result.rows[0]));

        } catch (error) {
            console.error(`Error al obtener ${elementName}:`, error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    const createRow = async (req: Request, res: Response): Promise<void> => {
        const client = createDbClient();
        await client.connect();

        try {
            const result = await client.query(
                `INSERT INTO ${tablename} (${allColnames})
                 VALUES (${allColnames.map((_, i) => `\$${i + 1}`).join(', ')})
                 RETURNING *`,
                allParams(req.body)
            );

            res.status(201).json(result.rows[0]);

        } catch (error) {
            console.error(`Error al crear ${elementName}:`, error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    const updateRow = async (req: Request, res: Response): Promise<void> => {
        const client = createDbClient();
        await client.connect();

        try {
            const result = await client.query(
                `UPDATE ${tablename}
                 SET ${allColnames.map((col, i) => `${col}=\$${i + 1}`).join(', ')}
                 WHERE ${pkDolarCondition(allColnames.length + 1)}
                 RETURNING *`,
                [...allParams(req.body), ...pkParams(req.params)]
            );

            if (result.rows.length === 0) {
                res.status(404).json({ error: `${elementName} no encontrado` });
                return;
            }

            res.json(result.rows[0]);

        } catch (error) {
            console.error(`Error al actualizar ${elementName}:`, error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    const deleteRow = async (req: Request, res: Response): Promise<void> => {
    const client = createDbClient();
    await client.connect();

    try {
        await client.query("BEGIN");

        const input = { ...req.params, ...req.query };

        const pkValues = pkParams(input);

        console.log("DELETE PK VALUES:", pkValues, "INPUT:", input);

        if (pkValues.some(v => v === undefined || v === null)) {
            await client.query("ROLLBACK");
            res.status(400).json({ error: "PK no recibida" });
            return
        }

        const childTables = tableDefs
            .filter(t =>
                t.fks.some(fk => fk.referencesTable === tableDef.name)
            )
            .map(t => ({
                table: t.name,
                fks: t.fks.filter(fk => fk.referencesTable === tableDef.name)
            }));

        for (const child of childTables) {
            for (const fk of child.fks) {
                const sql = `
                    DELETE FROM aida.${child.table}
                    WHERE ${fk.column} = $1
                `;
                await client.query(sql, pkValues);
            }
        }

        const deleteSQL = `
            DELETE FROM ${tablename}
            WHERE ${pkDolarCondition(1)}
            RETURNING *
        `;

        const result = await client.query(deleteSQL, pkValues);

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            res.status(404).json({ error: `${elementName} no encontrado` });
            return
        }

        await client.query("COMMIT");
        res.json({ message: `${elementName} eliminado correctamente` });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(`Error al eliminar ${elementName}:`, error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



    return {
        getRow,
        getAllRows,
        createRow,
        updateRow,
        deleteRow
    };
}
