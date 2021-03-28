import Knex from "knex";
import { tableExists } from "../core/db";

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (await tableExists("MainBlog", connection)) {
            return false;
        }

        await connection.schema.createTable("MainBlog", builder => {
            builder.increments("Id").primary().notNullable();
            builder.integer("Blog_id", 8).nullable();
            builder.integer("Kind", 2).notNullable()
        });

        const [left, right] = await connection("Blog")
            .orderBy("Date", "desc")
            .limit(2)
            .select<{ Id: string }[]>("Blog.Id");

        console.log(left, right);

        await connection("MainBlog").insert({ Blog_id: left !== undefined ? Number(left.Id) : undefined, Kind: 0 });
        await connection("MainBlog").insert({ Blog_id: right !== undefined ? Number(right.Id) : undefined, Kind: 1 });

        return true;

    } catch (err) {
        return Promise.reject(err);
    }
};