import { connection } from "../db";
import { Subscription } from "../../../api/site/notification";

export const subscribe = (subscribtion: Subscription): Promise<void> =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `INSERT INTO email (PrivateGallery_id, address) VALUES ('${subscribtion.privateGalleryId}', '${subscribtion.email}')`,
                (err, _, _fields) => {
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const alreadySubscribed = (subscribtion: Subscription): Promise<boolean> =>
    new Promise((resolve, reject) =>
        connection.query(
            `SELECT e.PrivateGallery_id FROM email AS e WHERE e.PrivateGallery_id = ${subscribtion.privateGalleryId} AND e.address LIKE '${subscribtion.email}'`,
            (_err, rows, _fields) => {
                resolve(rows.length !== 0);
            }
        )
    );
