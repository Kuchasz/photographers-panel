import { connection } from "../db";
import { Subscription } from "../../../api/site/notification";
import { RowDataPacket } from "mysql2";

export const subscribe = async (subscribtion: Subscription): Promise<void> => {
    try {
        await connection.beginTransaction();
        await connection.query(
            `INSERT INTO email (PrivateGallery_id, address) VALUES ('${subscribtion.privateGalleryId}', '${subscribtion.email}')`);
    } catch (err) {
        await connection.rollback();
        return Promise.reject();
    }
}

export const alreadySubscribed = async (subscribtion: Subscription): Promise<boolean> =>{
    const [rows] = await connection.query<RowDataPacket[]>(`
            SELECT e.PrivateGallery_id FROM email AS e WHERE e.PrivateGallery_id = ${subscribtion.privateGalleryId} AND e.address LIKE '${subscribtion.email}'`);

    return rows.length !== 0;
}