import { Knex } from "knex";
import { log } from "./log";

export const tableExists = async (tableName: string, knex: Knex): Promise<boolean> => {
    try {
        return await knex.schema.hasTable(tableName);
    } catch (err) {
        return Promise.reject(err);
    }

    // try {
    //     const [tables] = await connection.query<RowDataPacket[]>(`SHOW TABLES LIKE ?`, [tableName]);
    //     return tables.length === 1;
    // } catch (err) {
    //     return Promise.reject(err);
    // }
};

export const columnExists = async (tableName: string, columnName: string, knex: Knex): Promise<boolean> => {
    try {
        return await knex.schema.hasColumn(tableName, columnName);
    } catch (err) {
        return Promise.reject(err);
    }
    // try {

    //     const _tableExists = await tableExists(tableName, connection);
    //     if (!_tableExists)
    //         return false;

    //     const [fields] = await connection.query<RowDataPacket[]>(`SHOW COLUMNS FROM \`${tableName}\` LIKE ?`, [columnName]);
    //     return fields.length === 1;
    // } catch (err) {
    //     return Promise.reject(err);
    // }
};

export const renameTable = async (tableName: string, newTableName: string, knex: Knex): Promise<void> => {
    try {
        await knex.schema.renameTable(tableName, newTableName);
        log(`RENAMING ${tableName} => ${newTableName}`, null);
    } catch (err) {
        log(`RENAMING ${tableName} => ${newTableName}`, err);
        return Promise.reject(err);
    }

    // try {
    //     await connection.query(`RENAME TABLE \`${tableName}\` TO \`${newTableName}\``);
    //     log(`RENAMING ${tableName} => ${newTableName}`, null);
    // } catch (err) {
    //     log(`RENAMING ${tableName} => ${newTableName}`, err);
    //     return Promise.reject(err);
    // }
};

// export const changeColumnType = async (tableName: string, columnName: string, newDataType: string, knex: Knex): Promise<void> => {
//     try {
//         await knex.schema.alterTable(tableName, builder => builder.date)
//         log(`CHANGING ${tableName}.${columnName} datatype => ${newDataType}`, null);
//     } catch (err) {
//         log(`CHANGING ${tableName}.${columnName} datatype => ${newDataType}`, err);
//         return Promise.reject(err);
//     }

//     // try {
//     //     await connection.query(`ALTER TABLE ${tableName} CHANGE COLUMN ${columnName} ${columnName} ${newDataType}`);
//     //     log(`CHANGING ${tableName}.${columnName} datatype => ${newDataType}`, null);
//     // } catch (err) {
//     //     log(`CHANGING ${tableName}.${columnName} datatype => ${newDataType}`, err);
//     //     return Promise.reject(err);
//     // }
// }

export const renameColumn = async (
    tableName: string,
    columnName: string,
    newColumnName: string,
    dataType: string | null,
    knex: Knex
): Promise<void> => {
    try {
        await knex.schema.alterTable(tableName, (builder) => builder.renameColumn(columnName, newColumnName));
        log(`RENAMING ${tableName}.${columnName} => ${tableName}.${newColumnName}`, null);
    } catch (err) {
        log(`RENAMING ${tableName}.${columnName} => ${tableName}.${newColumnName}`, err);
        return Promise.reject(err);
    }
    // try {
    //     await connection.query(`ALTER TABLE \`${tableName}\` CHANGE COLUMN \`${columnName}\` \`${newColumnName}\` ${dataType}`);
    //     log(`RENAMING ${tableName}.${columnName} => ${tableName}.${newColumnName}`, null);
    // } catch (err) {
    //     log(`RENAMING ${tableName}.${columnName} => ${tableName}.${newColumnName}`, err);
    //     return Promise.reject(err);
    // }
};

export const runQuery = async (query: string, knex: Knex): Promise<void> => {
    try {
        const result = await knex.raw(query);
        log(`RUNNING: ${query}`, null);
        return Promise.resolve(result);
    } catch (err) {
        log(`RUNNING: ${query}`, err);
        return Promise.reject(err);
    }
};

// export const executeInTransaction = async (
//     connection: Knex,
//     sql: string,
//     values: any | any[] | { [param: string]: any }
// ) => {
//     try {
//         await connection.beginTransaction();
//         await connection.query(sql, values);
//         await connection.commit();
//     } catch (err) {
//         await connection.rollback();
//         return Promise.reject(err);
//     }
// };
