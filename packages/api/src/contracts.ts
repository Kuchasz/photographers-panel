import { Result } from './common';
import * as event from "./event/event";
import { LogInError, UserCredentials } from './panel/auth';
import * as blog from "./panel/blog";
import * as privateGallery from "./panel/private-gallery";
import * as site from "./panel/site";
import { getSiteVisits, SiteEventDto, SiteVisitsDto } from './panel/site';
import * as siteBlog from "./site/blog";
import * as siteMessage from "./site/message";
import * as siteGallery from "./site/private-gallery";
import * as siteVideo from "./site/video";
import * as auth from "./panel/auth";
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

type LogInResponse = {
    authToken: string;
    refreshToken: string;
    issuedAt: number;
    expireDate: number;
};

export const panelContract = c.router({
    auth: {
        logIn: {
            method: 'POST',
            path: auth.logIn.route,
            responses: {
                200: c.type<Result<LogInError, LogInResponse>>(),
            },
            body: c.type<UserCredentials>(),
        },
        viewLogIn: {
            method: 'GET',
            path: auth.viewLogIn.route,
            responses: {
                200: c.otherResponse({ contentType: 'text/html', body: z.string() }),
                500: c.type<string>(),
            },
        },
    },
    site: {
        getSiteVisits: {
            method: 'GET',
            path: getSiteVisits.route,
            responses: {
                200: c.type<SiteVisitsDto>(),
            },
            pathParams: c.type<{
                start: string;
                end: string;
            }>(),
        },
        getSiteEvents: {
            method: 'GET',
            path: site.getSiteEvents.route,
            responses: {
                200: c.type<SiteEventDto[]>(),
            },
        },
    },
    blog: {
        getBlogSelectList: {
            method: 'GET',
            path: blog.getBlogSelectList.route,
            responses: {
                200: c.type<blog.BlogSelectItem[]>(),
            },
        },
        getBlogsList: {
            method: 'GET',
            path: blog.getBlogsList.route,
            responses: {
                200: c.type<blog.BlogListItem[]>(),
            },
        },
        createBlog: {
            method: 'POST',
            path: blog.createBlog.route,
            responses: {
                200: c.type<blog.CreateBlogResult>(),
            },
            body: c.type<blog.BlogEditDto>(),
        },
        checkAliasIsUnique: {
            method: 'GET',
            path: blog.checkAliasIsUnique.route,
            responses: {
                200: c.type<boolean>(),
            },
            pathParams: c.type<{ alias: string, blogId?: string }>(),
        },
        changeBlogVisibility: {
            method: 'POST',
            path: blog.changeBlogVisibility.route,
            responses: {
                200: c.type<blog.ChangeBlogVisibilityResult>(),
            },
            body: c.type<blog.BlogVisibilityDto>(),
        },
        changeMainBlogAsset: {
            method: 'POST',
            path: blog.changeMainBlogAsset.route,
            responses: {
                200: c.type<blog.ChangeMainBlogAssetResult>(),
            },
            body: c.type<blog.MainBlogAssetDto>(),
        },
        editBlog: {
            method: 'POST',
            path: blog.editBlog.route,
            responses: {
                200: c.type<blog.BlogEditResult>(),
            },
            body: c.type<{ id: number; blog: blog.BlogEditDto }>(),
        },
        getBlogForEdit: {
            method: 'GET',
            path: blog.getBlogForEdit.route,
            responses: {
                200: c.type<blog.BlogEditDto>(),
            },
            pathParams: c.type<{ blogId: string }>(),
        },
        deleteBlog: {
            method: 'POST',
            path: blog.deleteBlog.route,
            responses: {
                200: c.type<blog.DeleteBlogResult>(),
            },
            body: c.type<{ id: number }>(),
        },
        uploadBlogAsset: {
            method: 'POST',
            path: blog.uploadBlogAsset.route,
            responses: {
                200: c.type<blog.UploadBlogAssetResult>(),
            },
            body: c.type<{ blogId: number, asset: File }>()
        },
        getBlogAssets: {
            method: 'GET',
            path: blog.getBlogAssets.route,
            responses: {
                200: c.type<blog.BlogAssetsListItemDto[]>(),
            },
            pathParams: c.type<{ blogId: string }>(),
        },
        deleteBlogAsset: {
            method: 'POST',
            path: blog.deleteBlogAsset.route,
            responses: {
                200: c.type<blog.DeleteBlogAssetResult>(),
            },
            body: c.type<{ id: number }>(),
        },
        changeBlogAssetAlt: {
            method: 'POST',
            path: blog.changeBlogAssetAlt.route,
            responses: {
                200: c.type<blog.ChangeBlogAssetAltResult>(),
            },
            body: c.type<{ id: number; alt: string }>(),
        },
        getBlogVisits: {
            method: 'GET',
            path: blog.getBlogVisits.route,
            responses: {
                200: c.type<blog.BlogVisitsDto>(),
            },
            pathParams: c.type<{ blogId: string; start: string; end: string }>(),
        },
        getMainBlogs: {
            method: 'GET',
            path: blog.getMainBlogs.route,
            responses: {
                200: c.type<blog.MainBlogsDto>(),
            },
        },
        changeMainBlogs: {
            method: 'POST',
            path: blog.changeMainBlogs.route,
            responses: {
                200: c.type<blog.ChangeMainBlogsResult>(),
            },
            body: c.type<blog.MainBlogsDto>(),
        },
    },
    privateGallery: {
        getGalleriesList: {
            method: 'GET',
            path: privateGallery.getGalleriesList.route,
            responses: {
                200: c.type<privateGallery.GalleryDto[]>(),
            },
        },
        getGalleryVisits: {
            method: 'GET',
            path: privateGallery.getGalleryVisits.route,
            responses: {
                200: c.type<privateGallery.GalleryVisitsDto>(),
            },
            pathParams: c.type<{ galleryId: string; start: string; end: string }>(),
        },
        checkPasswordIsUnique: {
            method: 'GET',
            path: privateGallery.checkPasswordIsUnique.route,
            responses: {
                200: c.type<boolean>(),
            },
            pathParams: c.type<{ password: string, galleryId?: string }>(),
        },
        createGallery: {
            method: 'POST',
            path: privateGallery.createGallery.route,
            responses: {
                200: c.type<privateGallery.CreateGalleryResult>(),
            },
            body: c.type<privateGallery.GalleryEditDto>(),
        },
        getGalleryForEdit: {
            method: 'GET',
            path: privateGallery.getGalleryForEdit.route,
            responses: {
                200: c.type<privateGallery.GalleryEditDto>(),
            },
            pathParams: c.type<{ galleryId: string }>(),
        },
        editGallery: {
            method: 'POST',
            path: privateGallery.editGallery.route,
            responses: {
                200: c.type<privateGallery.EditGalleryResult>(),
            },
            body: c.type<{ id: number; gallery: privateGallery.GalleryEditDto }>(),
        },
        deleteGallery: {
            method: 'POST',
            path: privateGallery.deleteGallery.route,
            responses: {
                200: c.type<privateGallery.DeleteGalleryResult>(),
            },
            body: c.type<{ id: number }>(),
        },
        getGalleryEmails: {
            method: 'GET',
            path: privateGallery.getGalleryEmails.route,
            responses: {
                200: c.type<privateGallery.GalleryEmailsDto>(),
            },
            pathParams: c.type<{ galleryId: string }>(),
        },
        notifySubscribers: {
            method: 'POST',
            path: privateGallery.notifySubscribers.route,
            responses: {
                200: c.type<privateGallery.NotifySubscribersResult>(),
            },
            body: c.type<{ id: number }>(),
        },
    },
});

export const eventContract = c.router({
    registerEvent: {
        method: 'POST',
        path: event.reqisterEvent.route,
        responses: {
            200: c.type<event.RegisterEventResult>(),
        },
        body: c.type<event.EventDto>(),
    },
    getEventsList: {
        method: 'GET',
        path: event.getEventsList.route,
        responses: {
            200: c.type<event.EventDto[]>(),
        },
    },
});

export const siteContract = c.router({
    blog: {
        getLastBlogs: {
            method: 'GET',
            path: siteBlog.getLastBlogs.route,
            responses: {
                200: c.type<siteBlog.BlogListItem[]>(),
            },
        },
        getBlogsList: {
            method: 'GET',
            path: siteBlog.getBlogsList.route,
            responses: {
                200: c.type<siteBlog.BlogListItem[]>(),
            },
        },
        getBlog: {
            method: 'GET',
            path: siteBlog.getBlog.route,
            responses: {
                200: c.type<siteBlog.Blog>(),
            },
            pathParams: c.type<{ alias: string }>(),
        },
    },
    message: {
        send: {
            method: 'POST',
            path: siteMessage.send.route,
            responses: {
                200: c.type<siteMessage.SendResult>(),
            },
            body: c.type<siteMessage.Message>(),
        },
    },
    privateGallery: {
        subscribeForNotification: {
            method: 'POST',
            path: siteGallery.subscribeForNotification.route,
            responses: {
                200: c.type<siteGallery.SubscribtionResult>(),
            },
            body: c.type<siteGallery.Subscription>(),
        },
        getGalleryUrl: {
            method: 'GET',
            path: siteGallery.getGalleryUrl.route,
            responses: {
                200: c.type<siteGallery.PrivateGalleryUrlCheckResult>(),
            },
            pathParams: c.type<{ password: string }>(),
        },
        viewGallery: {
            method: 'GET',
            path: siteGallery.viewGallery.route,
            responses: {
                200: c.otherResponse({ contentType: 'text/html', body: z.string() }),
            },
        },
        postViewGallery: {
            method: 'POST',
            path: siteGallery.viewGallery.route,
            responses: {
                200: c.otherResponse({ contentType: 'text/html', body: z.string() }),
            },
            body: c.type<{ galleryUrl: string; galleryId: number }>(),
        },
    },
    video: {
        getVideosList: {
            method: 'GET',
            path: siteVideo.getVideosList.route,
            responses: {
                200: c.type<siteVideo.VideoListItem[]>(),
            },
        },
    }
});