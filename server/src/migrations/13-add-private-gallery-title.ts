import Knex from 'knex';
import { tableExists, renameTable, columnExists, runQuery } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (await columnExists('PrivateGallery', 'Title', connection)) {
            return false;
        }

        await connection.schema.alterTable('PrivateGallery', (builder) => {
            builder.string('Title', 50);
            builder.string('Notes', 100);
        });

        await runQuery(`UPDATE "PrivateGallery" SET "Title" = CONCAT('Wesele ', "Bride", ' i ', "Groom");`, connection);
        await runQuery(`UPDATE "PrivateGallery" SET "Notes" = CONCAT("Place", ', ', "LastName");`, connection);

        await connection.schema.table('PrivateGallery', (t) => t.dropColumns('Bride', 'Groom', 'Place', 'LastName'));

        await connection.schema.alterTable('PrivateGallery', (builder) => {
            builder.string('Title', 50).notNullable().alter();
            builder.string('Notes', 100).notNullable().alter();
        });

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
