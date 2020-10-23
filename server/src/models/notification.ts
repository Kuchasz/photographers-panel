import { connection } from "../db";
import { Subscription } from "../../../api/site/notification";

export const subscribe = async (subscribtion: Subscription): Promise<void> => {
    try {
        await connection.raw(
            `INSERT INTO email (PrivateGallery_id, address) VALUES ('${subscribtion.privateGalleryId}', '${subscribtion.email}')`);
    } catch (err) {
        return Promise.reject();
    }
}

export const alreadySubscribed = async (subscribtion: Subscription): Promise<boolean> => {
    const [rows] = await connection.raw(`
            SELECT e.PrivateGallery_id FROM email AS e WHERE e.PrivateGallery_id = ${subscribtion.privateGalleryId} AND e.address LIKE '${subscribtion.email}'`);

    return rows.length !== 0;
}