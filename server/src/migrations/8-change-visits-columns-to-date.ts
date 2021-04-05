import Knex from 'knex';
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (!(await tableExists('PrivateGalleryDailyVisit', connection))) {
            return false;
        }

        // await changeColumnType("BlogVisit", "Date", "DATE", connection);
        // connection.query(`ALTER TABLE ${tableName} CHANGE COLUMN ${columnName} ${columnName} ${newDataType}`);

        // connection.raw("ALTER TABLE :tableName: ALTER COLUMN :columnName: ? ?")

        await connection.schema.alterTable('BlogVisit', (builder) => builder.date('Date').alter());

        await connection.schema.createTable('PrivateGalleryVisit', (builder) => {
            builder.increments('Id').primary().notNullable();
            builder.date('Date').notNullable();
            builder.string('Ip', 15);
            builder.integer('PrivateGallery_id', 8).notNullable();
        });

        // await runQuery(`CREATE TABLE "jarvis_pstudio"."PrivateGalleryVisit"(
        //         "Id" INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        //         "Date" DATE NOT NULL,
        //         "Ip" VARCHAR(15),
        //         "PrivateGallery_id" INT(8) NOT NULL
        //     );`, connection);

        type result = { PrivateGallery_id: number; date: Date; count: number };

        const results = await connection<result[]>('PrivateGalleryDailyVisit').select(
            'PrivateGallery_id',
            'date',
            'count'
        );

        // connection.query(
        //     `SELECT PrivateGallery_id, date, count FROM PrivateGalleryDailyVisit`,
        //     async (err, results: result[], _fields) => {
        //         if (err) rej(err);

        for (const daily of results) {
            try {
                const visits = Array.from(Array(daily.count));
                for (const _ of visits) {
                    await connection('PrivateGalleryVisit').insert({
                        PrivateGallery_id: daily.PrivateGallery_id,
                        Date: daily.date,
                    });
                }
                // await runQuery(`INSERT INTO "PrivateGalleryVisit"("PrivateGallery_id", "Date") VALUES ('${daily.PrivateGallery_id}', '${daily.date}')`, connection);
            } catch (err) {
                return Promise.reject(err);
                // rej(err);
            }
        }

        await runQuery(`DROP TABLE "PrivateGalleryDailyVisit"`, connection);

        return true;
        // res(true);
        // });
    } catch (err) {
        return Promise.reject(err);
    }
};

//
// await runQuery(`ALTER TABLE "Blog" ADD "MainBlogAsset_id" INT(11) NULL AFTER "isHidden";`, connection);
// changeColumnType
