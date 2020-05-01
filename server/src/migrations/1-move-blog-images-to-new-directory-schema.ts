import fs from "fs";
import { resolve, join } from "path";
import { Connection } from "mysql";

const withMinLength = (number: number, minLength: number) =>
    new Array(minLength - String(number).length + 1).join("0") + number;

const getDateString = (date: Date) => {
    const month = withMinLength(date.getMonth() + 1, 2);
    const day = withMinLength(date.getDate(), 2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const run = (connection: Connection): Promise<boolean> =>
    new Promise((res, rej) => {
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
            (_err, results: result[], _fields) => {
                const allPaths = results.map((p) => ({
                    old: oldPath(getDateString(p.date))(p.photourl),
                    new: newPath(p.id.toString())(p.photourl)
                }));

                allPaths.forEach((p) => {
                    const dirName = p.new.split("/").reverse().slice(1).reverse().join("/");
                    if (!fs.existsSync(dirName)) {
                        fs.mkdirSync(dirName);
                    }
                    fs.existsSync(p.old) && fs.renameSync(p.old, p.new);
                });

                res(true);
            }
        );
    });
