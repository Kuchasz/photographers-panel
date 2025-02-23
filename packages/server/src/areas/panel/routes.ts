import { createExpressEndpoints, initServer } from '@ts-rest/express';
import * as auth from "@pp/api/dist/panel/auth";
import * as blog from "@pp/api/dist/panel/blog";
import * as privateGallery from "@pp/api/dist/panel/private-gallery";
import * as site from "@pp/api/dist/panel/site";
import * as authController from "./auth";
import * as blogController from "./blog";
import * as privateGalleryController from "./private-gallery";
import * as siteController from "./site";
import multer from "multer";
import { Router as createRouter } from "express";
import { verify } from "../../auth";
import { UserCredentials } from '@pp/api/dist/panel/auth';
import { Result, ResultType } from '@pp/api/dist/common';
import { RequestHandler } from 'express';
import { panelContract } from '@pp/api/dist/contracts';

const upload = multer();
const r = createRouter();

// Create ts-rest routers
const s = initServer();

const authImplementation = s.router(panelContract.auth, {
    logIn: async ({ body, res }) => {
        const result = await authController.logIn(body, res);
        return { status: 200 as const, body: result };
    },
    viewLogIn: async () => {
        try {
            const html = await authController.viewLogIn();
            return { status: 200 as const, body: html };
        } catch (err) {
            return { status: 500 as const, body: 'Internal Server Error' };
        }
    },
});

const siteImplementation = s.router(panelContract.site, {
    getSiteVisits: async ({ params }) => {
        const result = await siteController.getSiteVisits(new Date(params.start), new Date(params.end));
        return { status: 200 as const, body: result };
    },
    getSiteEvents: async () => {
        const result = await siteController.getSiteEvents();
        return { status: 200 as const, body: result };
    },
});

const blogImplementation = s.router(panelContract.blog, {
    getBlogSelectList: async () => {
        const result = await blogController.getBlogSelectList();
        return { status: 200 as const, body: result };
    },
    getBlogsList: async () => {
        const result = await blogController.getBlogsList();
        return { status: 200 as const, body: result };
    },
    createBlog: async ({ body }: { body: blog.BlogEditDto }) => {
        const result = await blogController.createBlog(body);
        return { status: 200 as const, body: result };
    },
    checkAliasIsUnique: async ({ params }) => {
        const result = await blogController.checkAliasIsUnique(params.alias);
        return { status: 200 as const, body: result };
    },
    changeBlogVisibility: async ({ body }: { body: blog.BlogVisibilityDto }) => {
        const result = await blogController.changeBlogVisibility(body);
        return { status: 200 as const, body: result };
    },
    changeMainBlogAsset: async ({ body }: { body: blog.MainBlogAssetDto }) => {
        const result = await blogController.changeMainBlogAsset(body);
        return { status: 200 as const, body: result };
    },
    editBlog: async ({ body }: { body: { id: number; blog: blog.BlogEditDto } }) => {
        const result = await blogController.editBlog(body.id, body.blog);
        return { status: 200 as const, body: result };
    },
    getBlogForEdit: async ({ params }: { params: { blogId: string } }) => {
        const result = await blogController.getBlogForEdit(Number(params.blogId));
        return { status: 200 as const, body: result };
    },
    deleteBlog: async ({ body }: { body: { id: number } }) => {
        const result = await blogController.deleteBlog(body.id);
        return { status: 200 as const, body: result };
    },
    uploadBlogAsset: {
        middleware: [upload.single('asset')],
        handler: async ({ body, file }) => {
            if (!file) {
                return {
                    status: 400 as const,
                    body: {
                        type: ResultType.Error,
                        error: 'NoFileProvided',
                        errorMessage: 'No file was provided',
                    },
                };
            }
            const result = await blogController.uploadBlogAsset(body.blogId, file as unknown as Express.Multer.File);
            return { status: 200 as const, body: result };
        }
    },
    getBlogAssets: async ({ params }: { params: { blogId: string } }) => {
        const result = await blogController.getBlogAssets(Number(params.blogId));
        return { status: 200 as const, body: result };
    },
    deleteBlogAsset: async ({ body }: { body: { id: number } }) => {
        const result = await blogController.deleteBlogAsset(body.id);
        return { status: 200 as const, body: result };
    },
    changeBlogAssetAlt: async ({ body }: { body: { id: number; alt: string } }) => {
        const result = await blogController.changeBlogAssetAlt(body.id, body.alt);
        return { status: 200 as const, body: result };
    },
    getBlogVisits: async ({ params }: { params: { blogId: string; start: string; end: string } }) => {
        const result = await blogController.getBlogVisits(Number(params.blogId), new Date(params.start), new Date(params.end));
        return { status: 200 as const, body: result };
    },
    getMainBlogs: async () => {
        const result = await blogController.getMainBlogs();
        return { status: 200 as const, body: result };
    },
    changeMainBlogs: async ({ body }: { body: blog.MainBlogsDto }) => {
        const result = await blogController.changeMainBlogs(body);
        return { status: 200 as const, body: result };
    },
});

const privateGalleryImplementation = s.router(panelContract.privateGallery, {
    getGalleriesList: async () => {
        const result = await privateGalleryController.getGalleriesList();
        return { status: 200 as const, body: result };
    },
    getGalleryVisits: async ({ params }) => {
        const result = await privateGalleryController.getGalleryVisits(
            Number(params.galleryId),
            new Date(params.start),
            new Date(params.end)
        );
        return { status: 200 as const, body: result };
    },
    checkPasswordIsUnique: async ({ params }) => {
        const result = await privateGalleryController.checkPasswordIsUnique(
            params.password,
            params.galleryId ? Number(params.galleryId) : undefined
        );
        return { status: 200 as const, body: result };
    },
    createGallery: async ({ body }: { body: privateGallery.GalleryEditDto }) => {
        const result = await privateGalleryController.createGallery(body);
        return { status: 200 as const, body: result };
    },
    getGalleryForEdit: async ({ params }) => {
        const result = await privateGalleryController.getGalleryForEdit(Number(params.galleryId));
        return { status: 200 as const, body: result };
    },
    editGallery: async ({ body }) => {
        const result = await privateGalleryController.editGallery(body.id, body.gallery);
        return { status: 200 as const, body: result };
    },
    deleteGallery: async ({ body }) => {
        const result = await privateGalleryController.deleteGallery(body.id);
        return { status: 200 as const, body: result };
    },
    getGalleryEmails: async ({ params }) => {
        const result = await privateGalleryController.getGalleryEmails(Number(params.galleryId));
        return { status: 200 as const, body: result };
    },
    notifySubscribers: async ({ body }) => {
        const result = await privateGalleryController.notifySubscribers(body.id);
        return { status: 200 as const, body: result };
    },
});

// Mount ts-rest routers
createExpressEndpoints(panelContract.auth, authImplementation, r);
createExpressEndpoints(panelContract.site, siteImplementation, r, {
    globalMiddleware: [verify],
});
createExpressEndpoints(panelContract.blog, blogImplementation, r, {
    globalMiddleware: [verify],
});
createExpressEndpoints(panelContract.privateGallery, privateGalleryImplementation, r, {
    globalMiddleware: [verify],
});

export const router = r;
