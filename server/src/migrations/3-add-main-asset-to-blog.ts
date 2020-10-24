import Knex from "knex";
import { columnExists, runQuery } from "../core/db";

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (await columnExists("Blog", "MainBlogAsset_id", connection)) {
            return false;
        }

        await connection.schema.alterTable("Blog", builder => {
            builder.bigInteger("MainBlogAsset_id").nullable();
            builder.foreign("MainBlogAsset_id").references("BlogAsset.Id").onDelete("RESTRICT").onUpdate("RESTRICT");
        });

        const result = await runQuery(`SELECT * FROM "jarvis_pstudio"."Blog" LIMIT 1`, connection);
        // await runQuery(`ALTER TABLE \`Blog\` ADD \`MainBlogAsset_id\` INT(11) NULL AFTER \`isHidden\``, connection);
        // await runQuery(`ALTER TABLE \`Blog\` ADD CONSTRAINT \`Blog_BlogAsset_MainBlogAsset_id\` FOREIGN KEY (\`MainBlogAsset_id\`) REFERENCES \`BlogAsset\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`, connection);
        await runQuery(`UPDATE "jarvis_pstudio"."Blog" b SET "MainBlogAsset_id" = (SELECT "Id" FROM "BlogAsset" WHERE "Blog_id" = b."Id" LIMIT 1)`, connection);

        return true;

    } catch (err) {
        return Promise.reject(err);
    }
};