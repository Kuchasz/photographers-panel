import * as blog from "@pp/api/dist/site/blog";
import * as blogController from "./blog";
import * as message from "@pp/api/dist/site/message";
import * as messageController from "./message";
import * as privateGallery from "@pp/api/dist/site/private-gallery";
import * as privateGalleryController from "./private-gallery";
import { Router as createRouter, Router } from "express";

const r = createRouter();

r.get(blog.getLastBlogs.route, blogController.getLastBlogs);
r.get(blog.getBlogsList.route, blogController.getBlogsList);
r.get(blog.getBlog.route, blogController.getBlog);

r.post(message.send.route, messageController.send);

r.post(privateGallery.subscribeForNotification.route, privateGalleryController.subscribeForNotification);
r.get(privateGallery.getGalleryUrl.route, privateGalleryController.getGalleryUrl);
r.post(
    [`${privateGallery.viewGallery.route}`, `${privateGallery.viewGallery.route}/*`],
    privateGalleryController.postViewGallery
);
r.get(
    [`${privateGallery.viewGallery.route}`, `${privateGallery.viewGallery.route}/*`],
    privateGalleryController.getViewGallery
);

export const router = r as Router;
