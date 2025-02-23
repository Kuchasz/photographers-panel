import * as blog from "@pp/api/dist/site/blog";
import * as blogModel from "../../models/blog";

export const getLastBlogs = async (): Promise<blog.BlogListItem[]> => {
    return await blogModel.getMostRecent();
};

export const getBlogsList = async (): Promise<blog.BlogListItem[]> => {
    return await blogModel.getList();
};

export const getBlog = async (alias: string): Promise<blog.Blog> => {
    const blog = await blogModel.get(alias);
    await blogModel.registerVisit(blog.id, 'unknown', new Date()); // TODO: Get IP from request
    return blog;
};
