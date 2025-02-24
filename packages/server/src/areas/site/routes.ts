import * as blog from "@pp/api/dist/site/blog";
import * as blogController from "./blog";
import * as message from "@pp/api/dist/site/message";
import * as messageController from "./message";
import * as privateGallery from "@pp/api/dist/site/private-gallery";
import * as privateGalleryController from "./private-gallery";
import { Router as createRouter } from "express";
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { siteContract } from '@pp/api/dist/contracts';
import { getVideosList } from "./video";
import { getOffer, getOffersList } from "./offer";

const r = createRouter();
const s = initServer();

const siteImplementation = s.router(siteContract, {
    blog: {
        getLastBlogs: async () => {
            const result = await blogController.getLastBlogs();
            return { status: 200 as const, body: result };
        },
        getBlogsList: async () => {
            const result = await blogController.getBlogsList();
            return { status: 200 as const, body: result };
        },
        getBlog: async ({ params }) => {
            const result = await blogController.getBlog(params.alias);
            return { status: 200 as const, body: result };
        },
    },
    message: {
        send: async ({ body }) => {
            const result = await messageController.send(body);
            return { status: 200 as const, body: result };
        },
    },
    privateGallery: {
        subscribeForNotification: async ({ body }) => {
            const result = await privateGalleryController.subscribeForNotification(body);
            return { status: 200 as const, body: result };
        },
        getGalleryUrl: async ({ params }) => {
            const result = await privateGalleryController.getGalleryUrl(params.password);
            return { status: 200 as const, body: result };
        },
        viewGallery: async ({ req }) => {
            const result = await privateGalleryController.getViewGallery(req);
            return { status: 200 as const, body: result };
        },
        postViewGallery: async ({ req }) => {
            const result = await privateGalleryController.postViewGallery(req);
            return { status: 200 as const, body: result };
        },
    },
    video: {
        getVideosList: async () => {
            const result = await getVideosList();
            return { status: 200 as const, body: result };
        },
    },
    offer: {
        getOffersList: async () => {
            const result = await getOffersList();
            return { status: 200 as const, body: result };
        },
        getOffer: async ({ query }) => {
            const result = await getOffer(query.alias);
            return { status: 200 as const, body: result };
        },
    },
});

// Mount ts-rest router
createExpressEndpoints(siteContract, siteImplementation, r);

export const router = r;

