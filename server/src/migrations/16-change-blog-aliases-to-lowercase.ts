import Knex from 'knex';
import { runQuery } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        const blogsWithUppercase = await connection('Blog')
            .whereRaw(`"Blog"."Alias" != LOWER("Blog"."Alias")`)
            .select<number[]>('Blog.Id');

        if (blogsWithUppercase.length === 0) return false;

        await runQuery(`UPDATE "Blog" SET "Alias" = LOWER("Alias");`, connection);

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
