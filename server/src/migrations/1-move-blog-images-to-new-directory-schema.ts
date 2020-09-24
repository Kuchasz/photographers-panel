import fs from "fs";
import { resolve, join } from "path";
import { Connection } from "mysql";
import { deleteFolderRecursiveSync, rename } from "../core/fs";

const withMinLength = (number: number, minLength: number) =>
    new Array(minLength - String(number).length + 1).join("0") + number;

const getDateString = (date: Date) => {
    const month = withMinLength(date.getMonth() + 1, 2);
    const day = withMinLength(date.getDate(), 2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const run = (connection: Connection): Promise<boolean> =>
    new Promise(async (res, rej) => {
        if (!fs.existsSync(resolve("public/blog"))) {
            res(false);
            return;
        }

        if (!fs.existsSync(resolve("public/blogs"))) fs.mkdirSync(resolve("public/blogs"));

        const oldPath = (date: string) => (url: string) => resolve(join("public/blog", date, url));
        const newPath = (id: string) => (url: string) => resolve(join("public/blogs", id, url));

        type result = { id: number; date: Date; photourl: string };

        connection.query(
            `SELECT be.id, be.date, bep.photourl FROM blogentryphoto bep INNER JOIN blogentry be ON be.id = bep.BlogEntryId`,
            async (_err, results: result[], _fields) => {
                const allPaths = results.map((p) => ({
                    old: oldPath(getDateString(p.date))(p.photourl),
                    new: newPath(p.id.toString())(p.photourl)
                }));

                for (const p of allPaths) {
                    const dirName = p.new.split("/").reverse().slice(1).reverse().join("/");
                    if (!fs.existsSync(dirName)) {
                        fs.mkdirSync(dirName);
                    }
                    if (fs.existsSync(p.old)) {
                        await rename(p.old, p.new);
                    }
                }

                deleteFolderRecursiveSync("public/blog");
                
                res(true);
            }
        );
    });
