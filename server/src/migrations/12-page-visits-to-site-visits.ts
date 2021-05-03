import { Knex } from 'knex';
import { tableExists, renameTable } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (!(await tableExists('PageVisit', connection))) {
            return false;
        }

        await renameTable('PageVisit', 'SiteVisit', connection);

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
