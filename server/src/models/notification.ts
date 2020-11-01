import { connection } from "../db";
import { Subscription } from "../../../api/site/notification";

export const subscribe = async (subscribtion: Subscription): Promise<void> => {
    try {
        // await connection.raw(
        //     `INSERT INTO PrivateGalleryEmail (PrivateGallery_id, address) VALUES ('${subscribtion.privateGalleryId}', '${subscribtion.email}')`);

        await connection("PrivateGalleryEmail")
            .insert({
                PrivateGallery_id: subscribtion.privateGalleryId,
                Address: subscribtion.email
            });

    } catch (err) {
        return Promise.reject(err);
    }
}

export const alreadySubscribed = async (subscribtion: Subscription): Promise<boolean> => {
    // const [rows] = await connection.raw(`
    //         SELECT e.PrivateGallery_id FROM email AS e WHERE e.PrivateGallery_id = ${subscribtion.privateGalleryId} AND e.address LIKE '${subscribtion.email}'`);

    const rows = await connection("PrivateGalleryEmail")
        .where({ PrivateGallery_id: subscribtion.privateGalleryId, Address: subscribtion.email })
        .select("PrivateGallery_id")
        .limit(1);

    return rows.length !== 0;
}