import Knex from "knex";
import { runQuery } from "../core/db";

export const run = async (connection: Knex): Promise<boolean> => {
    try {

        await runQuery(`UPDATE "PrivateGallery" SET "DirectPath" = TRIM(REPLACE("DirectPath", 'http://', 'https://'));`, connection);

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};