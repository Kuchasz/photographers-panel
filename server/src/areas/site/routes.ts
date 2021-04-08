import { Router as createRouter } from "express";
import * as blogController from "./blog";
import * as blog from "@pp/api/site/blog";
import * as messageController from "./message";
import * as message from "@pp/api/site/message";
import * as privateGalleryController from "./private-gallery";
import * as privateGallery from "@pp/api/site/private-gallery";

const r = createRouter();

r.get(blog.getLastBlogs.route, blogController.getLastBlogs);
r.get(blog.getBlogsList.route, blogController.getBlogsList);
r.get(blog.getBlog.route, blogController.getBlog);

r.post(message.send.route, messageController.send);

r.post(privateGallery.subscribeForNotification.route, privateGalleryController.subscribeForNotification);
r.get(privateGallery.getGalleryUrl.route, privateGalleryController.getGalleryUrl);
r.post([`${privateGallery.viewGallery.route}`, `${privateGallery.viewGallery.route}/*`], privateGalleryController.postViewGallery);
r.get([`${privateGallery.viewGallery.route}`, `${privateGallery.viewGallery.route}/*`], privateGalleryController.getViewGallery);

export const router = r;