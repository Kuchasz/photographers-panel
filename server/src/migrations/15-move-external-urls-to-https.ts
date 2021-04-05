import Knex from 'knex';
import { runQuery } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        const privateGalleriesWithWrongDirectPath = await connection('PrivateGallery')
            .where('DirectPath', 'like', 'http://%')
            .select<number[]>('PrivateGallery.Id');

        if (privateGalleriesWithWrongDirectPath.length === 0) return false;

        await runQuery(
            `UPDATE "PrivateGallery" SET "DirectPath" = TRIM(REPLACE("DirectPath", 'http://', 'https://'));`,
            connection
        );

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
