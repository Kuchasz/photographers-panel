import { Connection } from "mysql2/promise";
import { columnExists, renameTable, renameColumn } from "../core/db";

type result = { Id: number; Tags: string };

const normalizeTags = (tags: string) =>
    tags
        .trim()
        .split(" ")
        .join("-")
        .normalize("NFD")
        .replace(/[^a-z0-9-]/g, "");

const runNormalizeTags = (r: result, connection: Connection): Promise<any> => 
    connection.query("UPDATE Blog SET Tags = ? WHERE Id = ?", [normalizeTags(r.Tags), r.Id]);

export const run = (connection: Connection): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (await columnExists("BlogAsset", "Blog_id", connection)) {
                res(false);
                return;
            }

            await renameTable("blogentry", "Blog", connection);
            await renameColumn("Blog", "id", "Id", "int(11)", connection);
            await renameColumn("Blog", "date", "Date", "date", connection);
            await renameColumn("Blog", "title", "Title", "varchar(200)", connection);
            await renameColumn("Blog", "alias", "Alias", "varchar(200)", connection);
            await renameColumn("Blog", "content", "Content", "varchar(1000)", connection);
            await renameColumn("Blog", "tags", "Tags", "varchar(100)", connection);
            await renameColumn("Blog", "isHidden", "IsHidden", "tinyint(1)", connection);

            await renameTable("blogcomment", "BlogComment", connection);
            await renameColumn("BlogComment", "blogEntry_id", "Blog_id", "int(11)", connection);
            await renameColumn("BlogComment", "id", "Id", "int(11)", connection);
            await renameColumn("BlogComment", "userName", "UserName", "varchar(255)", connection);
            await renameColumn("BlogComment", "content", "Content", "text", connection);
            await renameColumn("BlogComment", "date", "Date", "datetime", connection);
            await renameColumn("BlogComment", "state", "State", "enum('new', 'approved', 'rejected')", connection);

            await renameTable("blogvisit", "BlogVisit", connection);
            await renameColumn("BlogVisit", "BlogEntryId", "Blog_id", "int(11)", connection);
            await renameColumn("BlogVisit", "id", "Id", "int(12)", connection);
            await renameColumn("BlogVisit", "ip", "Ip", "varchar(15)", connection);
            await renameColumn("BlogVisit", "date", "Date", "datetime", connection);

            await renameTable("blogentryphoto", "BlogAsset", connection);
            await renameColumn("BlogAsset", "id", "Id", "int(11)", connection);
            await renameColumn("BlogAsset", "BlogEntryId", "Blog_id", "int(11)", connection);
            await renameColumn("BlogAsset", "photourl", "Url", "varchar(100)", connection);
            await renameColumn("BlogAsset", "alttext", "Alt", "varchar(150)", connection);

            connection.query(`SELECT b.Id, b.Tags FROM Blog b`, (_err, results: result[], _fields) => {
                const promises = results.map((x) => runNormalizeTags(x, connection));
                Promise.all(promises)
                    .then((x) => res(true))
                    .catch((err) => rej(err));
            });
        } catch (err) {
            rej(err);
        }
    });
