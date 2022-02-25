import { Knex } from 'knex';
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (!(await columnExists('PrivateGallery', 'BlogEntryId', connection))) {
            return false;
        }

        await renameColumn('PrivateGallery', 'BlogEntryId', 'Blog_id', 'int(11)', connection);

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
