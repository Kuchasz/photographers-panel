import * as blogModel from "../../models/blog";

export const getLastBlogs = async (_req: any, res: any) => {
    const blog = await blogModel.getMostRecent();
    res.json(blog);
};

export const getBlogsList = async (_req: any, res: any) => {
    const blogs = await blogModel.getList();
    res.json(blogs);
};

export const getBlog = async (req: any, res: any) => {
    const blog = await blogModel.get(req.params.alias);

    const address = (req.header('x-forwarded-for') || req.connection.remoteAddress)
        .replace('::ffff:', '')
        .split(',')[0];

    await blogModel.registerVisit(blog.id, address, new Date());

    res.json(blog);
};
