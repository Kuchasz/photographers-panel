import { ResultType } from "@pp/api/dist/common";
import * as blog from "@pp/api/dist/panel/blog";
import * as fs from "fs";
import { processImage } from "../../core";
import { deleteFile, deleteFolderRecursive } from "../../core/fs";
import * as blogModel from "../../models/blog";

export const getBlogSelectList = async (): Promise<blog.BlogSelectItem[]> => {
    return await blogModel.getSelectList();
};

export const getBlogsList = async (): Promise<blog.BlogListItem[]> => {
    return await blogModel.getListForPanel();
};

export const createBlog = async (data: blog.BlogEditDto): Promise<blog.CreateBlogResult> => {
    try {
        await blogModel.createBlog(data);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileCreatingBlog',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const checkAliasIsUnique = async (alias: string, blogId?: number): Promise<boolean> => {
    return await blogModel.checkAliasIsUnique(alias, blogId);
};

export const changeBlogVisibility = async (data: blog.BlogVisibilityDto): Promise<blog.ChangeBlogVisibilityResult> => {
    try {
        await blogModel.changeVisibility(data);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileChangingBlogVisibility',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const changeMainBlogAsset = async (data: blog.MainBlogAssetDto): Promise<blog.ChangeMainBlogAssetResult> => {
    try {
        await blogModel.changeMainAsset(data);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileChangingMainBlogAsset',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const editBlog = async (id: number, data: blog.BlogEditDto): Promise<blog.BlogEditResult> => {
    try {
        await blogModel.editBlog(id, data);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileEditingBlog',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const getBlogForEdit = async (blogId: number): Promise<blog.BlogEditDto> => {
    return await blogModel.getForEdit(blogId);
};

export const deleteBlog = async (id: number): Promise<blog.DeleteBlogResult> => {
    try {
        await blogModel.deleteBlog(id);
        const assetsPath = blogModel.getAssetsPath(id);
        await deleteFolderRecursive(assetsPath);
        return { type: ResultType.Success };
    } catch (err) {
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileDeletingBlog',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const uploadBlogAsset = async (blogId: number, file: Express.Multer.File): Promise<blog.UploadBlogAssetResult> => {
    try {
        const blogTags = await blogModel.getTags(blogId);
        const assetId = blogModel.getAssetId(blogTags);
        const assetsPath = blogModel.getAssetsPath(blogId);

        if (!fs.existsSync(assetsPath)) {
            fs.mkdirSync(assetsPath, { recursive: true });
        }

        const finalPath = blogModel.getAssetPath(assetsPath, assetId);
        await processImage(file.buffer)(finalPath);
        const blogAsset = await blogModel.createBlogAsset(blogId, assetId, '');

        return {
            type: ResultType.Success,
            result: {
                id: blogAsset.id,
                isMain: blogAsset.isMain,
                url: `/${finalPath}`,
            },
        };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileUploadingBlogAsset',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const getBlogAssets = async (blogId: number): Promise<blog.BlogAssetsListItemDto[]> => {
    return await blogModel.getAssetsForBlog(blogId);
};

export const deleteBlogAsset = async (id: number): Promise<blog.DeleteBlogAssetResult> => {
    try {
        const finalPath = await blogModel.getAssetPathById(id);
        await blogModel.deleteBlogAsset(id);
        await deleteFile(finalPath);
        return { type: ResultType.Success };
    } catch (err) {
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileDeletingBlogAsset',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const changeBlogAssetAlt = async (id: number, alt: string): Promise<blog.ChangeBlogAssetAltResult> => {
    try {
        await blogModel.changeBlogAssetAlt(id, alt);
        return { type: ResultType.Success };
    } catch (err) {
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileChangingBlogAssetError',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const getBlogVisits = async (blogId: number, startDate: Date, endDate: Date): Promise<blog.BlogVisitsDto> => {
    return await blogModel.getStats(blogId, startDate, endDate);
};

export const getMainBlogs = async (): Promise<blog.MainBlogsDto> => {
    return await blogModel.getMainBlogs();
};

export const changeMainBlogs = async (mainBlogs: blog.MainBlogsDto): Promise<blog.ChangeMainBlogsResult> => {
    try {
        await blogModel.changeMainBlogs(mainBlogs);
        return { type: ResultType.Success };
    } catch (err) {
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileChangingMainBlogs',
            errorMessage: JSON.stringify(err),
        };
    }
};
