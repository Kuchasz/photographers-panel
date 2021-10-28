import { Router as createRouter } from "express";
import * as authController from "./auth";
import * as auth from "@pp/api/panel/auth";
import * as siteController from "./site";
import * as site from "@pp/api/panel/site";
import * as blogController from "./blog";
import * as blog from "@pp/api/panel/blog";
import * as privateGalleryController from "./private-gallery";
import * as privateGallery from "@pp/api/panel/private-gallery";
import { verify } from "../../auth";
import multer from "multer";


const upload = multer();
const r = createRouter();

r.post(auth.logIn.route, authController.logIn);
r.get([`${auth.viewLogIn.route}`, `${auth.viewLogIn.route}/*`], authController.viewLogIn);

r.get(site.getSiteVisits.route, verify, siteController.getSiteVisits);
r.get(site.getSiteEvents.route, verify, siteController.getSiteEvents);

r.get(blog.getBlogSelectList.route, verify, blogController.getBlogSelectList);
r.get(blog.getBlogsList.route, verify, blogController.getBlogsList);
r.post(blog.createBlog.route, verify, blogController.createBlog);
r.get(blog.checkAliasIsUnique.route, verify, blogController.checkAliasIsUnique);
r.post(blog.changeBlogVisibility.route, verify, blogController.changeBlogVisibility);
r.post(blog.changeMainBlogAsset.route, verify, blogController.changeMainBlogAsset);
r.post(blog.editBlog.route, verify, blogController.editBlog);
r.get(blog.getBlogForEdit.route, verify, blogController.getBlogForEdit);
r.post(blog.deleteBlog.route, verify, blogController.deleteBlog);
r.post(blog.uploadBlogAsset.route, verify, upload.single('asset'), blogController.uploadBlogAsset);
r.get(blog.getBlogAssets.route, verify, blogController.getBlogAssets);
r.post(blog.deleteBlogAsset.route, verify, blogController.deleteBlogAsset);
r.post(blog.changeBlogAssetAlt.route, verify, blogController.changeBlogAssetAlt);
r.get(blog.getBlogVisits.route, verify, blogController.getBlogVisits);
r.get(blog.getMainBlogs.route, verify, blogController.getMainBlogs);
r.post(blog.changeMainBlogs.route, verify, blogController.changeMainBlogs);

r.get(privateGallery.getGalleriesList.route, verify, privateGalleryController.getGalleriesList);
r.get(privateGallery.getGalleryVisits.route, verify, privateGalleryController.getGalleryVisits);
r.get(privateGallery.checkPasswordIsUnique.route, verify, privateGalleryController.checkPasswordIsUnique);
r.get(privateGallery.getGalleryForEdit.route, verify, privateGalleryController.getGalleryForEdit);
r.get(privateGallery.getGalleryEmails.route, verify, privateGalleryController.getGalleryEmails);
r.post(privateGallery.createGallery.route, verify, privateGalleryController.createGallery);
r.post(privateGallery.notifySubscribers.route, verify, privateGalleryController.notifySubscribers);
r.post(privateGallery.editGallery.route, verify, privateGalleryController.editGallery);
r.post(privateGallery.deleteGallery.route, verify, privateGalleryController.deleteGallery);

export const router = r;