import { Connection } from "mysql2/promise";
import { log } from "./log";


export const tableExists = async (tableName: string, connection: Connection): Promise<boolean> => {
    try {
        const [_, fields] = await connection.query(`SHOW TABLES LIKE ?`, [tableName]);
        return fields.length === 1;
    } catch (err) {
        return Promise.reject();
    }
}

export const columnExists = async (tableName: string, columnName: string, connection: Connection): Promise<boolean> => {
    try {
        const [_, fields] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\` LIKE ?`, [columnName]);
        return fields.length === 1;
    } catch (err) {
        return Promise.reject();
    }
}

export const renameTable = async (tableName: string, newTableName: string, connection: Connection): Promise<void> => {
    try {
        await connection.query(`RENAME TABLE \`${tableName}\` TO \`${newTableName}\``);
        log(`RENAMING ${tableName} => ${newTableName}`, null);
    } catch (err) {
        log(`RENAMING ${tableName} => ${newTableName}`, err);
        return Promise.reject();
    }
}

export const changeColumnType = async (tableName: string, columnName: string, newDataType: string, connection: Connection): Promise<void> => {
    try {
        await connection.query(`ALTER TABLE ${tableName} CHANGE COLUMN ${columnName} ${columnName} ${newDataType}`);
        log(`CHANGING ${tableName}.${columnName} datatype => ${newDataType}`, null);
    } catch (err) {
        log(`CHANGING ${tableName}.${columnName} datatype => ${newDataType}`, err);
        return Promise.reject();
    }
}

export const renameColumn = async (
    tableName: string,
    columnName: string,
    newColumnName: string,
    dataType: string,
    connection: Connection
): Promise<void> => {
    try {
        await connection.query(`ALTER TABLE \`${tableName}\` CHANGE COLUMN \`${columnName}\` \`${newColumnName}\` ${dataType}`);
        log(`RENAMING ${tableName}.${columnName} => ${tableName}.${newColumnName}`, null);
    } catch (err) {
        log(`RENAMING ${tableName}.${columnName} => ${tableName}.${newColumnName}`, err);
        return Promise.reject();
    }
}

export const runQuery = async (query: string, connection: Connection): Promise<void> => {
    try {
        await connection.query(query);
        log(`RUNNING: ${query}`, null);
    } catch (err) {
        log(`RUNNING: ${query}`, err);
    }
}

export const executeInTransaction = async (connection, sql: string, values: any | any[] | { [param: string]: any }) => {
    try {
        await connection.beginTransaction();
        await connection.query(sql, values);
        await connection.commit();
    } catch (err) {
        await connection.rollback();
        return Promise.reject();
    }
}