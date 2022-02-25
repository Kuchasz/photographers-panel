import { Knex } from 'knex';
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (!(await tableExists('counter', connection))) {
            return false;
        }

        await renameTable('counter', 'PageVisit', connection);
        await renameTable('daily', 'PrivateGalleryDailyVisit', connection);
        await renameColumn('PrivateGalleryDailyVisit', 'PrivateGalleryId', 'PrivateGallery_id', 'int(8)', connection);

        await renameTable('email', 'PrivateGalleryEmail', connection);
        await renameColumn('PrivateGalleryEmail', 'PrivateGalleryId', 'PrivateGallery_id', 'int(8)', connection);

        await runQuery(`DROP TABLE "offerphoto";`, connection);
        await runQuery(`DROP TABLE "offer";`, connection);
        await runQuery(`DROP TABLE "photo";`, connection);
        await runQuery(`DROP TABLE "gallery";`, connection);

        await renameTable('privategallery', 'PrivateGallery', connection);

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
