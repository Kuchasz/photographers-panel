import { Connection } from "mysql";

const log = (message: string, err: any) => console.log(`${message} (${err === null ? "success" : "fail"})`);

export const tableExists = (tableName: string, connection: Connection): Promise<boolean> =>
    new Promise((res, rej) => {
        connection.query(`SHOW TABLES LIKE ?`, [tableName], (_err, matchedColumns, _fields) => {
            if (matchedColumns.length === 1) res(true);
            else res(false);
        });
    });

export const columnExists = (tableName: string, columnName: string, connection: Connection): Promise<boolean> =>
    new Promise((res, rej) => {
        connection.query(`SHOW COLUMNS FROM \`${tableName}\` LIKE ?`, [columnName], (_err, matchedColumns, _fields) => {
            if (_err) {
                res(false);
                return;
            }

            if (matchedColumns.length === 1) res(true);
            else res(false);
        });
    });

export const renameTable = (tableName: string, newTableName: string, connection: Connection): Promise<void> =>
    new Promise((res, rej) => {
        connection.query(`RENAME TABLE \`${tableName}\` TO \`${newTableName}\``, (_err) => {
            log(`RENAMING ${tableName} => ${newTableName}`, _err);
            if (_err) rej();
            else res();
        });
    });

export const renameColumn = (
    tableName: string,
    columnName: string,
    newColumnName: string,
    connection: Connection
): Promise<void> =>
    new Promise((res, rej) => {
        connection.query(
            `ALTER TABLE \`${tableName}\` RENAME COLUMN \`${columnName}\` TO \`${newColumnName}\``,
            (_err) => {
                log(`RENAMING ${tableName}.${columnName} => ${tableName}.${newColumnName}`, _err);
                if (_err) rej();
                else res();
            }
        );
    });
