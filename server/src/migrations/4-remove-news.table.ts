import { Knex } from 'knex';
import { columnExists, runQuery, tableExists } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (!(await tableExists('news', connection))) {
            return false;
        }

        await runQuery(`DROP TABLE "news";`, connection);
        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
