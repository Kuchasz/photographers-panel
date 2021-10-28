import { Knex } from 'knex';
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (await columnExists('PrivateGallery', 'Id', connection)) {
            return false;
        }

        await renameColumn('PrivateGalleryEmail', 'id', 'Id', null, connection);
        await renameColumn('PrivateGalleryEmail', 'address', 'Address', null, connection);

        await renameColumn('PageVisit', 'id', 'Id', null, connection);
        await renameColumn('PageVisit', 'IP', 'Ip', null, connection);
        await renameColumn('PageVisit', 'date', 'Date', null, connection);

        await renameTable('users', 'Users', connection);
        await renameColumn('Users', 'id', 'Id', null, connection);
        await renameColumn('Users', 'username', 'UserName', null, connection);
        await renameColumn('Users', 'password', 'Password', null, connection);
        await renameColumn('Users', 'role', 'Role', null, connection);

        await renameColumn('PrivateGallery', 'id', 'Id', null, connection);
        await renameColumn('PrivateGallery', 'date', 'Date', null, connection);
        await renameColumn('PrivateGallery', 'place', 'Place', null, connection);
        await renameColumn('PrivateGallery', 'bride', 'Bride', null, connection);
        await renameColumn('PrivateGallery', 'groom', 'Groom', null, connection);
        await renameColumn('PrivateGallery', 'lastname', 'LastName', null, connection);
        await renameColumn('PrivateGallery', 'state', 'State', null, connection);
        await renameColumn('PrivateGallery', 'pass', 'Password', null, connection);
        await renameColumn('PrivateGallery', 'dir', 'DirectPath', null, connection);

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
