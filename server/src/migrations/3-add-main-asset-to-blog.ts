import { Knex } from 'knex';
import { columnExists, runQuery } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (await columnExists('Blog', 'MainBlogAsset_id', connection)) {
            return false;
        }

        await connection.schema.alterTable('Blog', (builder) => {
            builder.bigInteger('MainBlogAsset_id').nullable();
            builder.foreign('MainBlogAsset_id').references('BlogAsset.Id').onDelete('RESTRICT').onUpdate('RESTRICT');
        });

        await runQuery(
            `UPDATE "Blog" b SET "MainBlogAsset_id" = (SELECT "Id" FROM "BlogAsset" WHERE "Blog_id" = b."Id" LIMIT 1)`,
            connection
        );

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
