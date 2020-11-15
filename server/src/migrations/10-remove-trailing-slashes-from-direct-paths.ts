import Knex from "knex";
import { columnExists, runQuery, tableExists, renameTable, renameColumn } from "../core/db";

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if ((await connection("PrivateGallery").where("DirectPath", "like", "%/")).length === 0) {
            return false;
        }

        type result = { Id: number; DirectPath: string };

        const galleries = await connection<result[]>("PrivateGallery").select("Id", "DirectPath");

        for (const gallery of galleries) {
            try {
                await connection("PrivateGallery").where({Id: gallery.Id}).update({DirectPath: gallery.DirectPath.replace(/\/$/, "")})
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return true;

    } catch (err) {
        return Promise.reject(err);
    }
};