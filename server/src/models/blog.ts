import { connection } from "../db";
import { getDateString } from "../../../utils/date";
import * as site from "../../../api/site/blog";
import * as panel from "../../../api/panel/blog";
import { RowDataPacket } from "mysql2/promise";

export const getMostRecent = async (): Promise<site.LastBlog> => {
    const [[mostRecent]] = await connection.query<RowDataPacket[]>(`
            SELECT alias, content, title FROM Blog 
            WHERE isHidden = 0 
            ORDER BY date DESC 
            LIMIT 1`);

    return mostRecent as site.LastBlog;
}

export const getList = async (): Promise<site.BlogListItem[]> => {
    const [blogs] = await connection.query<RowDataPacket[]>(`
            SELECT b.Id, b.title, b.date, b.alias, ba.Url, ba.Alt 
            FROM Blog b 
            LEFT JOIN BlogAsset ba ON ba.id = b.MainBlogAsset_id
            WHERE b.isHidden = 0 AND ba.Id IS NOT NULL
            ORDER BY b.date DESC`);

    const blogListItems = blogs.map((b: any) => ({
        title: b.title,
        date: getDateString(new Date(b.date)),
        alias: b.alias,
        photoUrl: `/${getAssetPath(getAssetsPath(b.Id), b.Url)}`
    }));

    return blogListItems;
}

export const get = async (alias: string): Promise<site.Blog> => {
    const [blogAssets] = await connection.query<RowDataPacket[]>(`
            SELECT b.Id, b.title, b.date, b.content, ba.Url, ba.Alt 
            FROM Blog b 
            JOIN BlogAsset ba ON b.id = ba.Blog_id 
            WHERE b.alias LIKE ?`);

    const [first] = blogAssets;

    const blog: site.Blog = {
        title: first.title,
        date: getDateString(new Date(first.date)),
        content: first.content,
        assets: blogAssets.map((p: any) => ({
            url: `/${getAssetPath(getAssetsPath(p.Id), p.Url)}`,
            alt: p.Alt
        }))
    };

    return blog;
}

export const registerVisit = (): Promise<any> =>
    connection.query(`
            INSERT INTO BlogVisit(Ip, Date, Blog_id) 
            VALUES (?, ?, ?)
            SELECT Ip, Date, Blog_id FROM DUAL 
            WHERE NOT EXISTS (SELECT * FROM BlogVisit 
            WHERE Ip=? AND Date=? AND Blog_id=? LIMIT 1)`)

export const getSelectList = async (): Promise<panel.BlogSelectItem[]> => {
    const blogs = await connection.query<RowDataPacket[]>(`
            SELECT b.title, b.date, b.id FROM Blog b 
            ORDER BY b.date DESC`);

    const blogSelectListItems = blogs.map((b: any) => ({
        label: `${b.title} (${getDateString(b.date)})`,
        value: b.id
    }));

    return blogSelectListItems;
}

export const getListForPanel = async (): Promise<panel.BlogListItem[]> => {
    const [blogs] = await connection.query<RowDataPacket[]>(`
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
            ORDER BY b.date DESC`);

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

    return blogListItems;
}

export const createBlog = async (blog: panel.BlogEditDto) => {
    try {
        await connection.beginTransaction();
        await connection.query(`
            INSERT INTO Blog(
                date, 
                title, 
                alias, 
                content, 
                tags,
                isHidden) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [blog.date, blog.title, blog.alias, blog.content, blog.tags, true]);
    } catch (err) {
        await connection.rollback();
        return Promise.reject();
    }
}

export const checkAliasIsUnique = async (alias: string, blogId?: number): Promise<boolean> => {
    const [[blog]] = await connection.query<RowDataPacket[]>(`
            SELECT b.id 
            FROM Blog b
            WHERE b.alias = ?`,
        [alias, blogId]);

    return !blog || blog.id === blogId;
}

export const changeVisibility = async (blogVisibility: panel.BlogVisibilityDto) => {
    try {
        await connection.beginTransaction();
        await connection.query(`
            UPDATE Blog
            SET isHidden = ?
            WHERE id = ?`,
            [!blogVisibility.shouldBeVisible, blogVisibility.id]);
    } catch (err) {
        connection.rollback();
        return Promise.reject();
    }
}

export const changeMainAsset = async (blogMainAsset: panel.MainBlogAssetDto) => {
    try {
        await connection.beginTransaction();
        await connection.query(`
            UPDATE Blog
            SET MainBlogAsset_id = ?
            WHERE id = ?`,
            [blogMainAsset.mainBlogAsset, blogMainAsset.id]);
    } catch (err) {
        connection.rollback();
        return Promise.reject();
    }
}

export const editBlog = async (id: number, blog: panel.BlogEditDto) => {
    try {
        await connection.beginTransaction();
        await connection.query(`
            UPDATE Blog
            SET
                date = ?, 
                title = ?, 
                alias = ?, 
                content = ?,
                tags = ?
            WHERE id = ?`,
            [blog.date, blog.title, blog.alias, blog.content, blog.tags, id]);
    } catch (err) {
        connection.rollback();
        return Promise.reject();
    }
}

export const getTags = async (blogId: number): Promise<string> => {
    const [[blog]]: any = await connection.query<RowDataPacket[]>(`
            SELECT b.alias
            FROM Blog b 
            WHERE b.id = ?`,
        [blogId, blogId]);

    return blog.alias;
}

export const getForEdit = async (blogId: number): Promise<panel.BlogEditDto> => {
    const [[blog]]: any = connection.query<RowDataPacket[]>(`
            SELECT b.title, b.alias, b.date, b.content, b.tags, (SELECT COUNT(id) FROM BlogAsset WHERE Blog_id = ?) as AssignmentsCount
            FROM Blog b 
            WHERE b.id = ?`,
        [blogId, blogId]);

    return {
        title: blog.title,
        alias: blog.alias,
        date: getDateString(blog.date),
        content: blog.content,
        tags: blog.tags,
        hasAssignments: blog.AssignmentsCount > 0
    };
}

export const deleteBlog = async (id: number) => {
    try {
        await connection.beginTransaction();
        await connection.query(`
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
            [id, id, id, id, id]);
    } catch (err) {
        connection.rollback();
        return Promise.reject();
    }
}

export const createBlogAsset = async (blogId: number, assetId: string, alt: string): Promise<number> => {
    try {
        await connection.beginTransaction();
        const [[results]]: any = await connection.query(`
            INSERT INTO BlogAsset(Blog_id, Url, Alt) VALUES (?, ?, ?)`,
            [blogId, assetId, alt]);
        return results.insertId;
    } catch (err) {
        connection.rollback();
        return Promise.reject();
    }
}

export const getAssetsForBlog = async (blogId: number): Promise<panel.BlogAssetsListItemDto[]> => {
    const [blogAssets] = await connection.query<RowDataPacket[]>(`
            SELECT b.MainBlogAsset_id, ba.id, ba.Url, ba.Alt
            FROM BlogAsset ba 
            JOIN Blog b ON ba.Blog_id = b.Id
            WHERE ba.Blog_id = ?`,
        [blogId]);

    return blogAssets.map(
        (ba: any) =>
            ({
                id: ba.id,
                url: `/${getAssetPath(getAssetsPath(blogId), ba.Url)}`,
                isMain: ba.MainBlogAsset_id === ba.id,
                alt: ba.Alt
            } as panel.BlogAssetsListItemDto)
    )
}

export const deleteBlogAsset = async (id: number) => {
    try {
        await connection.beginTransaction();
        await connection.query(`
            DELETE FROM BlogAsset
            WHERE Id = ?;`,
            [id]);
    } catch (err) {
        connection.rollback();
        return Promise.reject();
    }
}

export const getAssetPathById = async (id: number): Promise<string> => {
    const [[asset]]: any = await connection.query<RowDataPacket[]>(`
            SELECT ba.Url, ba.Blog_id
            FROM BlogAsset ba
            WHERE ba.Id = ?
            LIMIT 1`,
        [id]);

    return getAssetPath(getAssetsPath(asset.Blog_id), asset.Url);
}

export const changeBlogAssetAlt = async (id: number, alt: string): Promise<void> => {
    try {
        await connection.beginTransaction();
        await connection.query(`
            UPDATE BlogAsset
            SET Alt = ?
            WHERE Id = ?`,
            [alt, id]);
    } catch (err) {
        connection.rollback();
        return Promise.reject();
    }
}

export const getAssetsPath = (blogId: number) => `public/blogs/${blogId}`;
export const getAssetId = (blogTags: string) => `${blogTags}-${100000000 + Math.floor(Math.random() * 999999990)}.webp`;
export const getAssetPath = (assetsPath: string, assetId: string) => `${assetsPath}/${assetId}`;
