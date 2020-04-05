import { connection } from "../db";
import { getDateString } from "../../../utils/date";
import * as site from "../../../api/site/blog";
import * as panel from "../../../api/panel/blog";

export const getMostRecent = (): Promise<site.LastBlog> =>
    new Promise((resolve, reject) => {
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

export const getList = (): Promise<site.BlogListItem[]> =>
    new Promise((resolve, reject) => {
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

export const get = (alias: string): Promise<site.BlogEntry> =>
    new Promise((resolve, reject) => {
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

export const getSelectList = (): Promise<panel.BlogSelectItem[]> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
      SELECT be.title, be.date, be.id FROM blogentry be 
      ORDER BY be.date DESC`,
            (_err, blogs, _fields) => {
                const blogSelectListItems = blogs.map((b: any) => ({
                    label: `${b.title} (${getDateString(b.date)})`,
                    value: b.id
                }));

                resolve(blogSelectListItems);
            }
        );
    });

export const getListForPanel = (): Promise<panel.BlogListItem[]> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT be.id, be.date, be.title, SUBSTRING(be.content, 1, 50) as content, be.isHidden, COALESCE( bv.count, 0 ) AS visits, COALESCE( bc.count, 0 ) AS comments FROM blogentry be 
            LEFT JOIN 
            (SELECT BlogEntryId, COUNT(*) AS count 
             FROM blogvisit
             GROUP BY BlogEntryId) bv
            ON be.id = bv.BlogEntryId
            LEFT JOIN 
            (SELECT blogEntry_id, COUNT(*) AS count 
             FROM blogcomment
             GROUP BY blogEntry_id) bc
            ON be.id = bc.blogEntry_id
            ORDER BY be.date DESC`,
            (_err, blogs, _fields) => {
                const blogListItems = blogs.map(
                    (b: any) =>
                        <panel.BlogListItem>{
                            id: b.id,
                            date: getDateString(new Date(b.date)),
                            title: b.title,
                            content: `${b.content}...`,
                            visits: b.visits,
                            comments: b.comments,
                            visible: !b.isHidden
                        }
                );

                resolve(blogListItems);
            }
        );
    });

export const createBlog = (blog: panel.BlogCreateDto) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
                INSERT INTO blogentry(
                    date, 
                    title, 
                    alias, 
                    content, 
                    isHidden) 
                VALUES (?, ?, ?, ?, ?)`,
                [blog.date, blog.title, blog.alias, blog.content, true],
                (err, _, _fields) => {
                    if (err) connection.rollback();

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const checkAliasIsUnique = (alias: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT be.id 
            FROM blogentry be
            WHERE be.alias = ?`,
            [alias],
            (_err, blogs, _fields) => {
                resolve(blogs.length === 0);
            }
        );
    });

export const changeVisibility = (blogVisibility: panel.BlogVisibilityDto) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
            UPDATE blogentry
            SET isHidden = ?
            WHERE id = ?`,
                [!blogVisibility.shouldBeVisible, blogVisibility.id],
                (err, _, _fields) => {
                    if (err) connection.rollback();

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });
