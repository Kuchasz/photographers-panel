import { Connection } from "mysql2/promise";
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from "../core/db";

export const run = (connection: Connection): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (!(await tableExists("counter", connection))) {
                res(false);
                return;
            }

            await renameTable("counter", "PageVisit", connection);
            await renameTable("daily", "PrivateGalleryDailyVisit", connection);
            await renameColumn("PrivateGalleryDailyVisit", "PrivateGalleryId", "PrivateGallery_id", "int(8)", connection);
            
            await renameTable("email", "PrivateGalleryEmail", connection);
            await renameColumn("PrivateGalleryEmail", "PrivateGalleryId", "PrivateGallery_id", "int(8)", connection);
            
            await runQuery(`DROP TABLE \`offerphoto\`;`, connection);
            await runQuery(`DROP TABLE \`offer\`;`, connection);
            await runQuery(`DROP TABLE \`photo\`;`, connection);
            await runQuery(`DROP TABLE \`gallery\`;`, connection);

            await renameTable("privategallery", "PrivateGallery", connection);

            res(true);

        } catch (err) {
            rej(err);
        }
    });
