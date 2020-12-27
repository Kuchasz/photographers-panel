import Knex from "knex";
import { columnExists } from "../core/db";

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (!(await columnExists("Users", "Role", connection))) {
            return false;
        }

        await connection.schema.alterTable("Users", b => {
            b.dropColumn("Role");
        });

        await connection.schema.alterTable("BlogAsset", builder => {
            builder.string("Url", 120).alter();
        });

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};