import { connection } from "../db";
import { Subscription } from "../../../api/subscribe-for-notification";

export const subscribe = (subscribtion: Subscription) =>
    new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO email (PrivateGalleryId, address) VALUES (${subscribtion.privateGalleryId}, ${subscribtion.email})`,
            (err, _, _fields) => {
                err == null ? resolve() : reject(err);
            }
        );
    });
