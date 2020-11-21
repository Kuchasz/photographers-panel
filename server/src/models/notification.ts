import { connection } from "../db";
import { Subscription } from "@pp/api/site/notification";

export const subscribe = async (subscribtion: Subscription): Promise<void> => {
    try {

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

    const rows = await connection("PrivateGalleryEmail")
        .where({ PrivateGallery_id: subscribtion.privateGalleryId, Address: subscribtion.email })
        .select("PrivateGallery_id")
        .limit(1);

    return rows.length !== 0;
}