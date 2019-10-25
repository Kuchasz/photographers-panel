import { connection } from "../db";
import { LastBlog } from "../../../api/get-last-blog";
import { BlogListItem } from "../../../api/get-blogs-list";
import { getDateString } from "../../../utils/date";
import { BlogEntry } from "../../../api/get-blog";

export const getMostRecent = (): Promise<LastBlog> => {
    return new Promise((resolve, reject) => {
        connection.query(
            `
      SELECT alias, content, title FROM blogentry 
      WHERE isHidden = 0 
      ORDER BY date DESC 
      LIMIT 1`,
            (_err, [first], _fields) => {
                resolve(first);
            }
        );
    });
};

export const getList = (): Promise<BlogListItem[]> => {
    return new Promise((resolve, reject) => {
        connection.query(
            `
      SELECT be.title, be.date, be.alias, bep.photourl, bep.alttext FROM blogentry be 
      JOIN blogentryphoto bep ON bep.id = (
          SELECT id from blogentryphoto
          WHERE BlogEntryId = be.id
          LIMIT 1)
      WHERE be.isHidden = 0 
      ORDER BY be.date DESC`,
            (_err, blogs, _fields) => {
                const blogListItems = blogs.map((b: any) => ({
                    title: b.title,
                    date: getDateString(new Date(b.date)),
                    alias: b.alias,
                    photoUrl: `http://pyszstudio.pl/media/images/blog/${getDateString(new Date(b.date))}/${b.photourl}`
                }));

                resolve(blogListItems);
            }
        );
    });
};

export const get = (alias: string): Promise<BlogEntry> => {
    return new Promise((resolve, reject) => {
        connection.query(
            `
        SELECT be.title, be.date, be.content, bep.photourl, bep.alttext 
        FROM blogentry be 
        JOIN blogentryphoto bep ON be.id = bep.BlogEntryId 
        WHERE be.alias LIKE '${alias}'
        `,
            (_err, blogEntryPhotos, _fields) => {
                const [first] = blogEntryPhotos;
                const blog = {
                    title: first.title,
                    date: getDateString(new Date(first.date)),
                    content: first.content,
                    photos: blogEntryPhotos.map((p: any) => ({
                        photoUrl: `http://pyszstudio.pl/media/images/blog/${getDateString(new Date(first.date))}/${
                            p.photourl
                        }`,
                        altText: p.alttext
                    }))
                };

                resolve(blog);
            }
        );
    });
};
