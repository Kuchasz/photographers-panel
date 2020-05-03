import { connection } from "../db";
import { getDateString } from "../../../utils/date";
import * as site from "../../../api/site/blog";
import * as panel from "../../../api/panel/blog";
import { resolve } from "dns";

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
      LEFT JOIN BlogAsset ba ON ba.id = b.MainBlogAsset_id
      WHERE b.isHidden = 0 AND ba.Id IS NOT NULL
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
                const blog: site.Blog = {
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
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }
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
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }
                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const changeMainAsset = (blogMainAsset: panel.MainBlogAssetDto) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
            UPDATE Blog
            SET MainBlogAsset_id = ?
            WHERE id = ?`,
                [blogMainAsset.mainBlogAsset, blogMainAsset.id],
                (err, _, _fields) => {
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }
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
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }
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
            UPDATE Blog
            SET MainBlogAsset_id = NULL
            WHERE id = ?;
 
            DELETE FROM BlogAsset
            WHERE Blog_id = ?;
            
            DELETE FROM BlogComment
            WHERE Blog_id = ?;

            DELETE FROM BlogVisit
            WHERE Blog_id = ?;
            
            DELETE FROM Blog
            WHERE id = ?;`,
                [id, id, id, id, id],
                (err, _, _fields) => {
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }

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
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }
                    err == null ? resolve(results.insertId) : reject(err);
                }
            );
        });
    });

export const getAssetsForBlog = (blogId: number): Promise<panel.BlogAssetsListItemDto[]> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
        SELECT b.MainBlogAsset_id, ba.id, ba.Url, ba.Alt
        FROM BlogAsset ba 
        JOIN Blog b ON ba.Blog_id = b.Id
        WHERE ba.Blog_id = ?`,
            [blogId],
            (_err, blogAssets: { MainBlogAsset_id: number; id: number; Url: string; Alt: string }[], _fields) => {
                resolve(
                    blogAssets.map(
                        (ba: any) =>
                            ({
                                id: ba.id,
                                url: `http://192.168.56.102:8080/${getAssetPath(getAssetsPath(blogId), ba.Url)}`,
                                isMain: ba.MainBlogAsset_id === ba.id,
                                alt: ba.Alt
                            } as panel.BlogAssetsListItemDto)
                    )
                );
            }
        );
    });

export const deleteBlogAsset = (id: number) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
            DELETE FROM BlogAsset
            WHERE Id = ?;`,
                [id],
                (err, _, _fields) => {
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const getAssetPathById = (id: number): Promise<string> =>
    new Promise((res, rej) => {
        connection.query(
            `
        SELECT ba.Url, ba.Blog_id
        FROM BlogAsset ba
        WHERE ba.Id = ?
        LIMIT 1`,
            [id],
            (_err, [asset], _fields) => {
                res(getAssetPath(getAssetsPath(asset.Blog_id), asset.Url));
            }
        );
    });

export const changeBlogAssetAlt = (id: number, alt: string): Promise<void> =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `
                UPDATE BlogAsset
                SET Alt = ?
                WHERE Id = ?`,
                [alt, id],
                (err, _, _fields) => {
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const getAssetsPath = (blogId: number) => `public/blogs/${blogId}`;
export const getAssetId = (blogTags: string) => `${blogTags}-${100000000 + Math.floor(Math.random() * 999999990)}.webp`;
export const getAssetPath = (assetsPath: string, assetId: string) => `${assetsPath}/${assetId}`;
