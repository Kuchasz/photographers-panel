import { connection } from "../db";
import { getDateString } from "@pp/utils/date";
import * as site from "@pp/api/site/blog";
import * as panel from "@pp/api/panel/blog";

export const getMostRecent = async (): Promise<site.LastBlog> => {
    const [mostRecent] = await connection("Blog").where({ IsHidden: 0 }).orderBy("Date", "desc").limit(1);

    return { alias: mostRecent.Alias, content: mostRecent.Content, title: mostRecent.Title } as site.LastBlog;
}

export const getList = async (): Promise<site.BlogListItem[]> => {
    const blogs = await connection("Blog")
        .leftJoin("BlogAsset", "BlogAsset.Id", "Blog.MainBlogAsset_id")
        .where({ IsHidden: 0 })
        .whereNotNull("BlogAsset.Id")
        .orderBy("Blog.Date", "desc")
        .select("Blog.Id", "BlogAsset.Url", "Blog.Title", "Blog.Date", "Blog.Alias");

    const blogListItems = blogs.map((b: any) => ({
        title: b.Title,
        date: getDateString(new Date(b.Date)),
        alias: b.Alias,
        photoUrl: `/${getAssetPath(getAssetsPath(b.Id), b.Url)}`
    }));

    return blogListItems;
}

export const get = async (alias: string): Promise<site.Blog> => {

    const blogWithAssets = await connection("Blog")
        .join("BlogAsset", "BlogAsset.Blog_id", "Blog.Id")
        .where({ Alias: alias })
        .select("Blog.Id", "Blog.Title", "Blog.Date", "Blog.Content", "BlogAsset.Url", "BlogAsset.Alt");

    const [first] = blogWithAssets;

    const blog: site.Blog = {
        title: first.Title,
        date: getDateString(new Date(first.Date)),
        content: first.Content,
        assets: blogWithAssets.map((p: any) => ({
            url: `/${getAssetPath(getAssetsPath(p.Id), p.Url)}`,
            alt: p.Alt
        })),
        id: first.Id
    };

    return blog;
}

export const registerVisit = (blogId: number, ip: string, date: Date): Promise<any> =>
    connection.raw(`
        INSERT INTO "BlogVisit" ("Ip", "Date", "Blog_id") 
        SELECT ?, ?, ?
        WHERE
            NOT EXISTS (
                SELECT "Id" FROM "BlogVisit" WHERE "Ip"=? AND "Date"=? AND "Blog_id"=?
            )`, [ip, date, blogId, ip, date, blogId]);

export const getSelectList = async (): Promise<panel.BlogSelectItem[]> => {

    const blogs = await connection("Blog")
        .orderBy("Date", "desc")
        .select("Title", "Date", "Id");

    const blogSelectListItems = blogs.map((b: any) => ({
        label: `${b.Title} (${getDateString(b.Date)})`,
        value: Number(b.Id)
    }));

    return blogSelectListItems;
}

export const getListForPanel = async (): Promise<panel.BlogListItem[]> => {

    const blogs = await connection("Blog")
        .select(
            "Blog.Id",
            "Blog.Date",
            "Blog.Title",
            connection.raw(`SUBSTRING("Blog"."Content", 1, 50) as "Content"`),
            "Blog.IsHidden",
            connection.raw(`COALESCE("BlogVisit"."Count", 0) as "Visits"`),
            connection.raw(`COALESCE("BlogComment"."Count", 0) as "Comments"`))
        .leftJoin(
            connection("BlogVisit")
                .select(connection.raw(`"Blog_id", COUNT(*) as "Count"`))
                .groupBy("Blog_id")
                .as("BlogVisit"), "BlogVisit.Blog_id", "Blog.Id")
        .leftJoin(
            connection("BlogComment")
                .select(connection.raw(`"Blog_id", COUNT(*) as "Count"`))
                .groupBy("Blog_id")
                .as("BlogComment"), "BlogComment.Blog_id", "Blog.Id")
        .orderBy("Blog.Date", "desc");

    const blogListItems = blogs.map(
        (b: any) =>
            <panel.BlogListItem>{
                id: b.Id,
                date: getDateString(new Date(b.Date)),
                title: b.Title,
                content: `${b.Content}...`,
                visits: b.Visits,
                comments: b.Comments,
                visible: !b.IsHidden
            }
    );

    return blogListItems;
}

export const createBlog = async (blog: panel.BlogEditDto) => {
    try {
        await connection("Blog").insert({
            Date: blog.date,
            Title: blog.title,
            Alias: blog.alias,
            Content: blog.content,
            Tags: blog.tags,
            IsHidden: true
        });
    } catch (err) {
        return Promise.reject();
    }
}

export const checkAliasIsUnique = async (alias: string, blogId?: number): Promise<boolean> => {

    const blog = await connection("Blog")
        .where({ Alias: alias })
        .select("Id")
        .first();

    return !blog || blog.Id === blogId;
}

export const changeVisibility = async (blogVisibility: panel.BlogVisibilityDto) => {
    try {

        await connection("Blog")
            .where({ Id: blogVisibility.id })
            .update({ IsHidden: !blogVisibility.shouldBeVisible });

    } catch (err) {
        return Promise.reject();
    }
}

export const changeMainAsset = async (blogMainAsset: panel.MainBlogAssetDto) => {
    try {

        await connection("Blog")
            .update({ MainBlogAsset_id: blogMainAsset.mainBlogAsset })
            .where({ Id: blogMainAsset.id });

    } catch (err) {
        return Promise.reject(err);
    }
}

export const editBlog = async (id: number, blog: panel.BlogEditDto) => {
    try {

        await connection("Blog")
            .where({ Id: id })
            .update({ Date: blog.date, Title: blog.title, Alias: blog.alias, Content: blog.content, Tags: blog.tags });

    } catch (err) {
        return Promise.reject();
    }
}

export const getTags = async (blogId: number): Promise<string> => {

    const [blog] = await connection("Blog")
        .where({ Id: blogId })
        .select("Tags");

    return blog.Tags;
}

export const getForEdit = async (blogId: number): Promise<panel.BlogEditDto> => {

    const [blog] = await connection("Blog")
        .where({ Id: blogId })
        .select("Title", "Alias", "Date", "Content", "Tags",
            connection("BlogAsset")
                .where({ Blog_id: blogId })
                .count("Id")
                .as("AssignmentsCount"));

    return {
        title: blog.Title,
        alias: blog.Alias,
        date: getDateString(blog.Date),
        content: blog.Content,
        tags: blog.Tags,
        hasAssignments: blog.AssignmentsCount > 0
    };
}

export const deleteBlog = async (id: number) => {
    const transaction = await connection.transaction();
    try {

        await transaction("Blog")
            .update({ MainBlogAsset_id: null })
            .where({ Id: id });

        await transaction("BlogAsset")
            .delete()
            .where({ Blog_id: id });

        await transaction("BlogComment")
            .delete()
            .where({ Blog_id: id });

        await transaction("BlogVisit")
            .delete()
            .where({ Blog_id: id });

        await transaction("Blog")
            .delete()
            .where({ Id: id });

        await transaction.commit();

    } catch (err) {
        await transaction.rollback();
        return Promise.reject(err);
    }
}

export const createBlogAsset = async (blogId: number, assetId: string, alt: string): Promise<number> => {
    try {

        return (await connection("BlogAsset")
            .insert({ Blog_id: blogId, Url: assetId, Alt: alt }, "Id"))[0];

    } catch (err) {
        return Promise.reject(err);
    }
}

export const getAssetsForBlog = async (blogId: number): Promise<panel.BlogAssetsListItemDto[]> => {

    const blogAssets = await connection("BlogAsset")
        .join("Blog", "Blog.Id", "BlogAsset.Blog_id")
        .where({ Blog_id: blogId })
        .select("Blog.MainBlogAsset_id", "BlogAsset.Id", "BlogAsset.Url", "BlogAsset.Alt");

    return blogAssets.map(
        (ba: any) =>
            ({
                id: ba.Id,
                url: `/${getAssetPath(getAssetsPath(blogId), ba.Url)}`,
                isMain: ba.MainBlogAsset_id === ba.Id,
                alt: ba.Alt
            } as panel.BlogAssetsListItemDto)
    )
}

export const deleteBlogAsset = async (id: number) => {
    try {

        await connection("BlogAsset")
            .delete()
            .where({ Id: id });

    } catch (err) {
        return Promise.reject();
    }
}

export const getAssetPathById = async (id: number): Promise<string> => {

    const [asset] = await connection("BlogAsset")
        .where({ Id: id })
        .select("Url", "Blog_id")
        .limit(1);

    return getAssetPath(getAssetsPath(asset.Blog_id), asset.Url);
}

export const changeBlogAssetAlt = async (id: number, alt: string): Promise<void> => {
    try {

        await connection("BlogAsset")
            .update({ Alt: alt })
            .where({ Id: id });

    } catch (err) {
        return Promise.reject();
    }
}

export const getAssetsPath = (blogId: number) => `public/blogs/${blogId}`;
export const getAssetId = (blogTags: string) => `${blogTags}-${100000000 + Math.floor(Math.random() * 999999990)}.webp`;
export const getAssetPath = (assetsPath: string, assetId: string) => `${assetsPath}/${assetId}`;
