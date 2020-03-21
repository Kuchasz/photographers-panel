import { connection } from "../db";
import { Subscription } from "../../../api/site/notification";

export const subscribe = (subscribtion: Subscription): Promise<void> =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `INSERT INTO email (PrivateGalleryId, address) VALUES ('${subscribtion.privateGalleryId}', '${subscribtion.email}')`,
                (err, _, _fields) => {
                    if(err)
                        connection.rollback();

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const alreadySubscribed = (subscribtion: Subscription): Promise<boolean> =>
    new Promise((resolve, reject) =>
        connection.query(
            `SELECT e.PrivateGalleryId FROM email AS e WHERE e.PrivateGalleryId = ${subscribtion.privateGalleryId} AND e.address LIKE '${subscribtion.email}'`,
            (_err, rows, _fields) => {
                resolve(rows.length !== 0);
            }
        )
    );
