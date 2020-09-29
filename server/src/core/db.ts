import { Connection } from "mysql";
import { log } from "./log";


export const tableExists = (tableName: string, connection: Connection): Promise<boolean> =>
    new Promise((res, rej) => {
        connection.query(`SHOW TABLES LIKE ?`, [tableName], (err, matchedColumns) => {
            if (matchedColumns.length === 1) res(true);
            else res(false);
        });
    });

export const columnExists = (tableName: string, columnName: string, connection: Connection): Promise<boolean> =>
    new Promise((res, rej) => {
        connection.query(`SHOW COLUMNS FROM \`${tableName}\` LIKE ?`, [columnName], (err, matchedColumns) => {
            if (err) {
                res(false);
                return;
            }

            if (matchedColumns.length === 1) res(true);
            else res(false);
        });
    });

export const renameTable = (tableName: string, newTableName: string, connection: Connection): Promise<void> =>
    new Promise((res, rej) => {
        connection.query(`RENAME TABLE \`${tableName}\` TO \`${newTableName}\``, (err) => {
            log(`RENAMING ${tableName} => ${newTableName}`, err);
            if (err) { rej(err) }
            else res();
        });
    });

export const renameColumn = (
    tableName: string,
    columnName: string,
    newColumnName: string,
    dataType: string,
    connection: Connection
): Promise<void> =>
    new Promise((res, rej) => {
        connection.query(
            `ALTER TABLE \`${tableName}\` CHANGE COLUMN \`${columnName}\` \`${newColumnName}\` ${dataType}`,
            (err) => {
                log(`RENAMING ${tableName}.${columnName} => ${tableName}.${newColumnName}`, err);
                if (err) rej(err);
                else res();
            }
        );
    });

export const runQuery = (query: string, connection: Connection) =>
    new Promise((res, rej) => {
        connection.query(query, (err) => {
            log(`RUNNING: ${query}`, err);
            if (err) rej();
            else res();
        });
    });
