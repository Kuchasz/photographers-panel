import Knex from "knex";
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from "../core/db";

export const run = (connection: Knex): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (!(await tableExists("PrivateGalleryDailyVisit", connection))) {
                res(false);
                return;
            }

            await changeColumnType("BlogVisit", "Date", "DATE", connection);
            await runQuery(`CREATE TABLE \`PrivateGalleryVisit\` (
                \`Id\` INT(11) NOT NULL AUTO_INCREMENT,
                \`Date\` DATE NOT NULL,
                \`Ip\` VARCHAR(15),
                \`PrivateGallery_id\` INT(8) NOT NULL,
                PRIMARY KEY (\`Id\`)
            )`, connection);

            type result = { PrivateGallery_id: number; date: Date; count: number };

            connection.query(
                `SELECT PrivateGallery_id, date, count FROM PrivateGalleryDailyVisit`,
                async (err, results: result[], _fields) => {
                    if (err) rej(err);

                    for (const daily of results) {
                        try {
                            await runQuery(`INSERT INTO PrivateGalleryVisit(PrivateGallery_id, Date) VALUES (\`${daily.PrivateGallery_id}\`, \`${daily.date}\`)`, connection);

                        } catch (err) {
                            rej(err);
                        }
                    }

                    await runQuery(`DROP TABLE \`PrivateGalleryDailyVisit\``, connection);

                    res(true);
                });

        } catch (err) {
            rej(err);
        }
    });



//
// await runQuery(`ALTER TABLE \`Blog\` ADD \`MainBlogAsset_id\` INT(11) NULL AFTER \`isHidden\`;`, connection);
// changeColumnType