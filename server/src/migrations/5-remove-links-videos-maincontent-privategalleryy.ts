import Knex from 'knex';
import { columnExists, runQuery, tableExists } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (!(await tableExists('link', connection))) {
            return false;
        }

        await runQuery(`DROP TABLE "link";`, connection);
        await runQuery(`DROP TABLE "video";`, connection);
        await runQuery(`DROP TABLE "privategalleryy";`, connection);
        await runQuery(`DROP TABLE "maincontent";`, connection);

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
