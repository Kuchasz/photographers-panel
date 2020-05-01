import { connection } from "../db";
import { getDateString } from "../../../utils/date";
import * as site from "../../../api/site/blog";
import * as panel from "../../../api/panel/blog";

export const getMostRecent = (): Promise<site.LastBlog> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
      SELECT alias, content, title FROM Blog 
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
      SELECT b.Id, b.title, b.date, b.alias, ba.Url, ba.Alt 
      FROM Blog b 
      JOIN BlogAsset ba ON ba.id = (
          SELECT id from BlogAsset
          WHERE Blog_id = b.id
          LIMIT 1)
      WHERE b.isHidden = 0 
      ORDER BY b.date DESC`,
            (_err, blogs, _fields) => {
                const blogListItems = blogs.map((b: any) => ({
                    title: b.title,
                    date: getDateString(new Date(b.date)),
                    alias: b.alias,
                    photoUrl: `http://192.168.56.102:8080/${getAssetPath(getAssetsPath(b.Id), b.Url)}`
                }));

                resolve(blogListItems);
            }
        );
    });

export const get = (alias: string): Promise<site.Blog> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
        SELECT b.Id, b.title, b.date, b.content, ba.Url, ba.Alt 
        FROM Blog b 
        JOIN BlogAsset ba ON b.id = ba.Blog_id 
        WHERE b.alias LIKE ?
        `,
            [alias],
            (_err, blogAssets, _fields) => {
                const [first] = blogAssets;
                const blog = {
                    title: first.title,
                    date: getDateString(new Date(first.date)),
                    content: first.content,
                    assets: blogAssets.map((p: any) => ({
                        url: `http://192.168.56.102:8080/${getAssetPath(getAssetsPath(p.Id), p.Url)}`,
                        alt: p.Alt
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
      SELECT b.title, b.date, b.id FROM Blog b 
      ORDER BY b.date DESC`,
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
            SELECT b.id, b.date, b.title, SUBSTRING(b.content, 1, 50) as content, b.isHidden, COALESCE( bv.count, 0 ) AS visits, COALESCE( bc.count, 0 ) AS comments FROM Blog b 
            LEFT JOIN 
            (SELECT Blog_id, COUNT(*) AS count 
             FROM BlogVisit
             GROUP BY Blog_id) bv
            ON b.id = bv.Blog_id
            LEFT JOIN 
            (SELECT Blog_id, COUNT(*) AS count 
             FROM BlogComment
             GROUP BY Blog_id) bc
            ON b.id = bc.Blog_id
            ORDER BY b.date DESC`,
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

export const createBlog = (blog: panel.BlogEditDto) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
                INSERT INTO Blog(
                    date, 
                    title, 
                    alias, 
                    content, 
                    tags,
                    isHidden) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [blog.date, blog.title, blog.alias, blog.content, blog.tags, true],
                (err, _, _fields) => {
                    if (err) connection.rollback();

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const checkAliasIsUnique = (alias: string, blogId?: number): Promise<boolean> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT b.id 
            FROM Blog b
            WHERE b.alias = ?`,
            [alias, blogId],
            (_err, blogs, _fields) => {
                const [blog] = blogs;
                if (!blog) {
                    resolve(true);
                } else {
                    resolve(blog.id === blogId);
                }
            }
        );
    });

export const changeVisibility = (blogVisibility: panel.BlogVisibilityDto) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
            UPDATE Blog
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

export const editBlog = (id: number, blog: panel.BlogEditDto) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
                UPDATE Blog
                SET
                    date = ?, 
                    title = ?, 
                    alias = ?, 
                    content = ?,
                    tags = ?
                WHERE id = ?`,
                [blog.date, blog.title, blog.alias, blog.content, blog.tags, id],
                (err, _, _fields) => {
                    if (err) connection.rollback();

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const getTags = (blogId: number): Promise<string> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT b.alias
            FROM Blog b 
            WHERE b.id = ?`,
            [blogId, blogId],
            (_err, [blog], _fields) => {
                resolve(blog.alias);
            }
        );
    });

export const getForEdit = (blogId: number): Promise<panel.BlogEditDto> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT b.title, b.alias, b.date, b.content, b.tags, (SELECT COUNT(id) FROM BlogAsset WHERE Blog_id = ?) as AssignmentsCount
            FROM Blog b 
            WHERE b.id = ?`,
            [blogId, blogId],
            (_err, [blog], _fields) => {
                resolve({
                    title: blog.title,
                    alias: blog.alias,
                    date: getDateString(blog.date),
                    content: blog.content,
                    tags: blog.tags,
                    hasAssignments: blog.AssignmentsCount > 0
                });
            }
        );
    });

export const deleteBlog = (id: number) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
            DELETE FROM Blog
            WHERE id = ?;
            
            DELETE FROM BlogAsset
            WHERE Blog_id = ?;
            
            DELETE FROM BlogComment
            WHERE Blog_id = ?;

            DELETE FROM BlogVisit
            WHERE Blog_id = ?;`,
                [id, id, id, id],
                (err, _, _fields) => {
                    if (err) connection.rollback();

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const createBlogAsset = (blogId: number, assetId: string, alt: string): Promise<number> =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `INSERT INTO BlogAsset(Blog_id, Url, Alt) VALUES (?, ?, ?)`,
                [blogId, assetId, alt],
                (err, results, _fields) => {
                    if (err) connection.rollback();
                    err == null ? resolve(results.insertId) : reject(err);
                }
            );
        });
    });

export const getAssetsForBlog = (blogId: number): Promise<panel.BlogAssetsListItemDto[]> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
        SELECT ba.id, ba.Url
        FROM BlogAsset ba 
        WHERE ba.Blog_id = ?`,
            [blogId],
            (_err, blogAssets, _fields) => {
                resolve(
                    blogAssets.map((ba: any) => ({
                        id: ba.id,
                        url: `http://192.168.56.102:8080/${getAssetPath(getAssetsPath(blogId), ba.Url)}`
                    }))
                );
            }
        );
    });

export const getAssetsPath = (blogId: number) => `public/blogs/${blogId}`;
export const getAssetId = (blogTags: string) => `${blogTags}-${100000000 + Math.floor(Math.random() * 999999990)}.jpg`;
export const getAssetPath = (assetsPath: string, assetId: string) => `${assetsPath}/${assetId}`;
