import { Connection } from "mysql";
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from "../core/db";

export const run = (connection: Connection): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (!(await columnExists("PrivateGallery", "BlogEntryId", connection))) {
                res(false);
                return;
            }

            await renameColumn("PrivateGallery", "BlogEntryId", "Blog_id", "int(11)", connection);

            res(true);

        } catch (err) {
            rej(err);
        }
    });
