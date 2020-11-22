import Knex from "knex";
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from "../core/db";

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (await columnExists("PrivateGallery", "SubscribersNotified", connection)) {
            return false;
        }

        await connection.schema.alterTable("PrivateGallery", builder => {
            builder.boolean("SubscribersNotified").nullable();
        });

        await connection("PrivateGallery").where("State", ">", "0").update({ SubscribersNotified: true });
        await connection("PrivateGallery").where("State", "=", "0").update({ SubscribersNotified: false });

        await connection.schema.alterTable("PrivateGallery", builder => {
            builder.boolean("SubscribersNotified").notNullable().alter();
        });

        return true;

    } catch (err) {
        return Promise.reject(err);
    }
};