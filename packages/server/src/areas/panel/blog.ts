import * as blog from "@pp/api/dist/panel/blog";
import * as blogModel from "../../models/blog";
import * as fs from "fs";
import multer from "multer";
import { deleteFile, deleteFolderRecursive } from "../../core/fs";
import { processImage } from "../../core";
import { ResultType } from "@pp/api/dist/common";

export const getBlogSelectList = async (req: any, res: any) => {
    const blogs = await blogModel.getSelectList();
    res.json(blogs);
};

export const getBlogsList = async (req: any, res: any) => {
    const blogs = await blogModel.getListForPanel();
    res.json(blogs);
};

export const createBlog = async (req: any, res: any) => {
    let result: blog.CreateBlogResult | undefined = undefined;

    try {
        await blogModel.createBlog(req.body as blog.BlogEditDto);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileCreatingBlog',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const checkAliasIsUnique = async (req: any, res: any) => {
    const aliasUnique = await blogModel.checkAliasIsUnique(
        req.params.alias,
        req.params.blogId ? Number(req.params.blogId) : undefined
    );
    res.json(aliasUnique);
};

export const changeBlogVisibility = async (req: any, res: any) => {
    let result: blog.ChangeBlogVisibilityResult | undefined = undefined;

    try {
        await blogModel.changeVisibility(req.body as blog.BlogVisibilityDto);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileChangingBlogVisibility',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const changeMainBlogAsset = async (req: any, res: any) => {
    let result: blog.ChangeMainBlogAssetResult | undefined = undefined;

    try {
        await blogModel.changeMainAsset(req.body as blog.MainBlogAssetDto);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileChangingMainBlogAsset',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const editBlog = async (req: any, res: any) => {
    let result: blog.BlogEditResult | undefined = undefined;

    var { id, blog }: { id: number; blog: blog.BlogEditDto } = req.body;

    try {
        await blogModel.editBlog(id, blog);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileEditingBlog',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const getBlogForEdit = async (req: any, res: any) => {
    const blog = await blogModel.getForEdit(Number(req.params.blogId));
    res.json(blog);
};

export const deleteBlog = async (req: any, res: any) => {
    let result: blog.DeleteBlogResult | undefined = undefined;

    var { id }: { id: number } = req.body;

    try {
        await blogModel.deleteBlog(id);
        const assetsPath = blogModel.getAssetsPath(id);

        await deleteFolderRecursive(assetsPath);

        result = { type: ResultType.Success };
    } catch (err) {
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileDeletingBlog',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const uploadBlogAsset = async (req: Express.Request, res: any) => {
    let result: blog.UploadBlogAssetResult | undefined = undefined;

    const blogId: number = (req as any).body.blogId;

    try {
        const blogTags = await blogModel.getTags(blogId);

        const assetId = blogModel.getAssetId(blogTags);

        const assetsPath = blogModel.getAssetsPath(blogId);

        if (!fs.existsSync(assetsPath)) {
            fs.mkdirSync(assetsPath, { recursive: true });
        }

        const finalPath = blogModel.getAssetPath(assetsPath, assetId);

        await processImage(req.file.buffer)(finalPath);

        const blogAseet = await blogModel.createBlogAsset(blogId, assetId, '');

        result = {
            type: ResultType.Success,
            result: {
                id: blogAseet.id,
                isMain: blogAseet.isMain,
                url: `/${finalPath}`,
            },
        };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileUploadingBlogAsset',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const getBlogAssets = async (req: any, res: any) => {
    const blogAssets = await blogModel.getAssetsForBlog(Number(req.params.blogId));
    res.json(blogAssets);
};

export const deleteBlogAsset = async (req: any, res: any) => {
    let result: blog.DeleteBlogAssetResult | undefined = undefined;

    var { id }: { id: number } = req.body;

    try {
        const finalPath = await blogModel.getAssetPathById(id);
        await blogModel.deleteBlogAsset(id);
        await deleteFile(finalPath);

        result = { type: ResultType.Success };
    } catch (err) {
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileDeletingBlogAsset',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const changeBlogAssetAlt = async (req: any, res: any) => {
    let result: blog.ChangeBlogAssetAltResult | undefined = undefined;

    var { id, alt }: { id: number; alt: string } = req.body;

    try {
        await blogModel.changeBlogAssetAlt(id, alt);

        result = { type: ResultType.Success };
    } catch (err) {
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileChangingBlogAssetError',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const getBlogVisits = async (req: any, res: any) => {
    const blogStats = await blogModel.getStats(
        Number.parseInt(req.params.blogId),
        new Date(req.params.start),
        new Date(req.params.end)
    );
    res.json(blogStats);
};

export const getMainBlogs = async (req: any, res: any) => {
    const mainBlogs = await blogModel.getMainBlogs();
    res.json(mainBlogs);
};

export const changeMainBlogs = async (req: any, res: any) => {
    let result: blog.ChangeMainBlogsResult | undefined = undefined;

    var mainBlogs: blog.MainBlogsDto = req.body;

    try {
        await blogModel.changeMainBlogs(mainBlogs);

        result = { type: ResultType.Success };
    } catch (err) {
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileChangingMainBlogs',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};
