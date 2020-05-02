import { Connection } from "mysql";
import { columnExists, renameTable, renameColumn } from "../core/db";

export const run = (connection: Connection): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (await columnExists("Blog", "MainBlogAsset_id", connection)) {
                res(false);
                return;
            }

            res(true);

        } catch (err) {
            rej(err);
        }
    });
