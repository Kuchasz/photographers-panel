import Knex from "knex";
import { columnExists, runQuery, tableExists } from "../core/db";

export const run = (connection: Knex): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (!(await tableExists("link", connection))) {
                res(false);
                return;
            }

            await runQuery(`DROP TABLE \`link\`;`, connection);
            await runQuery(`DROP TABLE \`video\`;`, connection);
            await runQuery(`DROP TABLE \`privategalleryy\`;`, connection);
            await runQuery(`DROP TABLE \`maincontent\`;`, connection);


            res(true);

        } catch (err) {
            rej(err);
        }
    });
