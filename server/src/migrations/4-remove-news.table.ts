import { Connection } from "mysql";
import { columnExists, runQuery, tableExists } from "../core/db";

export const run = (connection: Connection): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (!(await tableExists("news", connection))) {
                res(false);
                return;
            }

            await runQuery(`DROP TABLE \`news\`;`, connection);

            res(true);

        } catch (err) {
            rej(err);
        }
    });
