import fs from 'fs';
import Knex from 'knex';
import { resolve, join } from 'path';
import { deleteFolderRecursiveSync, rename } from '../core/fs';

const withMinLength = (number: number, minLength: number) =>
    new Array(minLength - String(number).length + 1).join('0') + number;

const getDateString = (date: Date) => {
    const month = withMinLength(date.getMonth() + 1, 2);
    const day = withMinLength(date.getDate(), 2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (!fs.existsSync(resolve('public/blog'))) {
            return false;
        }

        if (!fs.existsSync(resolve('public/blogs'))) fs.mkdirSync(resolve('public/blogs'));

        const oldPath = (date: string) => (url: string) => resolve(join('public/blog', date, url));
        const newPath = (id: string) => (url: string) => resolve(join('public/blogs', id, url));

        type result = { id: number; date: Date; photourl: string };

        const results = await connection('blogentryphoto')
            .innerJoin('blogentry', 'blogentry.id', 'blogentryphoto.BlogEntryId')
            .select<result[]>('blogentry.id', 'blogentry.date', 'blogentryphoto.photourl');

        const allPaths = results.map((p) => ({
            old: oldPath(getDateString(p.date))(p.photourl),
            new: newPath(p.id.toString())(p.photourl),
        }));

        for (const p of allPaths) {
            const dirName = p.new.split('/').reverse().slice(1).reverse().join('/');
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
            }
            if (fs.existsSync(p.old)) {
                await rename(p.old, p.new);
            }
        }

        deleteFolderRecursiveSync('public/blog');
        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
