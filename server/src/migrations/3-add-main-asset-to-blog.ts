import Knex from "knex";
import { columnExists, runQuery } from "../core/db";

export const run = (connection: Knex): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (await columnExists("Blog", "MainBlogAsset_id", connection)) {
                res(false);
                return;
            }

            await runQuery(`ALTER TABLE \`Blog\` ADD \`MainBlogAsset_id\` INT(11) NULL AFTER \`isHidden\`;`, connection);
            await runQuery(`ALTER TABLE \`Blog\` ADD CONSTRAINT \`Blog_BlogAsset_MainBlogAsset_id\` FOREIGN KEY (\`MainBlogAsset_id\`) REFERENCES \`BlogAsset\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT;`, connection);
            await runQuery(`UPDATE \`Blog\` b SET \`MainBlogAsset_id\` = (SELECT Id FROM BlogAsset WHERE Blog_id = b.Id LIMIT 1)`, connection);

            res(true);

        } catch (err) {
            rej(err);
        }
    });
