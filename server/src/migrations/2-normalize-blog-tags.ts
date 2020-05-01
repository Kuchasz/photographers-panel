import { Connection } from "mysql";
import { columnExists, renameTable, renameColumn } from "../core/db";

type result = { Id: number; Tags: string };

const normalizeTags = (tags: string) =>
    tags
        .trim()
        .split(" ")
        .join("-")
        .normalize("NFD")
        .replace(/[^a-z0-9-]/g, "");

const runNormalizeTags = (r: result, connection: Connection): Promise<void> =>
    new Promise((res, rej) => {
        connection.query("UPDATE Blog SET Tags = ? WHERE Id = ?", [normalizeTags(r.Tags), r.Id], (_err) => {
            if (_err) {
                rej(_err);
                return;
            }
            res();
        });
    });

export const run = (connection: Connection): Promise<boolean> =>
    new Promise<boolean>(async (res, rej) => {
        try {
            if (await columnExists("BlogAsset", "Blog_id", connection)) {
                res(false);
                return;
            }

            await renameTable("blogentry", "Blog", connection);
            await renameColumn("Blog", "id", "Id", connection);
            await renameColumn("Blog", "date", "Date", connection);
            await renameColumn("Blog", "title", "Title", connection);
            await renameColumn("Blog", "alias", "Alias", connection);
            await renameColumn("Blog", "content", "Content", connection);
            await renameColumn("Blog", "tags", "Tags", connection);
            await renameColumn("Blog", "isHidden", "IsHidden", connection);

            await renameTable("blogcomment", "BlogComment", connection);
            await renameColumn("BlogComment", "blogEntry_id", "Blog_id", connection);
            await renameColumn("BlogComment", "id", "Id", connection);
            await renameColumn("BlogComment", "userName", "UserName", connection);
            await renameColumn("BlogComment", "content", "Content", connection);
            await renameColumn("BlogComment", "date", "Date", connection);
            await renameColumn("BlogComment", "state", "State", connection);

            await renameTable("blogvisit", "BlogVisit", connection);
            await renameColumn("BlogVisit", "BlogEntryId", "Blog_id", connection);
            await renameColumn("BlogVisit", "id", "Id", connection);
            await renameColumn("BlogVisit", "ip", "Ip", connection);
            await renameColumn("BlogVisit", "date", "Date", connection);

            await renameTable("blogentryphoto", "BlogAsset", connection);
            await renameColumn("BlogAsset", "id", "Id", connection);
            await renameColumn("BlogAsset", "BlogEntryId", "Blog_id", connection);
            await renameColumn("BlogAsset", "photourl", "Url", connection);
            await renameColumn("BlogAsset", "alttext", "Alt", connection);

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
