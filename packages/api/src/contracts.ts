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
import * as siteOffer from "./site/offer";
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
            path: '/api/panel/log-in',
            responses: {
                200: c.type<Result<LogInError, LogInResponse>>(),
            },
            body: c.type<UserCredentials>(),
        },
        viewLogIn: {
            method: 'GET',
            path: '/panel',
            responses: {
                200: c.otherResponse({ contentType: 'text/html', body: z.string() }),
                500: c.type<string>(),
            },
        },
    },
    site: {
        getSiteVisits: {
            method: 'GET',
            path: '/api/panel/site-stats/:start/:end',
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
            path: '/api/panel/site-events',
            responses: {
                200: c.type<SiteEventDto[]>(),
            },
        },
    },
    blog: {
        getBlogSelectList: {
            method: 'GET',
            path: '/api/panel/blog-select-list',
            responses: {
                200: c.type<blog.BlogSelectItem[]>(),
            },
        },
        getBlogsList: {
            method: 'GET',
            path: '/api/panel/blogs-list',
            responses: {
                200: c.type<blog.BlogListItem[]>(),
            },
        },
        createBlog: {
            method: 'POST',
            path: '/api/panel/create-blog',
            responses: {
                200: c.type<blog.CreateBlogResult>(),
            },
            body: c.type<blog.BlogEditDto>(),
        },
        checkAliasIsUnique: {
            method: 'GET',
            path: '/api/panel/blog-alias-unique/:alias/:blogId?',
            responses: {
                200: c.type<boolean>(),
            },
            pathParams: c.type<{ alias: string, blogId?: string }>(),
        },
        changeBlogVisibility: {
            method: 'POST',
            path: '/api/panel/blog-change-visibility',
            responses: {
                200: c.type<blog.ChangeBlogVisibilityResult>(),
            },
            body: c.type<blog.BlogVisibilityDto>(),
        },
        changeMainBlogAsset: {
            method: 'POST',
            path: '/api/panel/blog-change-main-asset',
            responses: {
                200: c.type<blog.ChangeMainBlogAssetResult>(),
            },
            body: c.type<blog.MainBlogAssetDto>(),
        },
        editBlog: {
            method: 'POST',
            path: '/api/panel/edit-blog',
            responses: {
                200: c.type<blog.BlogEditResult>(),
            },
            body: c.type<{ id: number; blog: blog.BlogEditDto }>(),
        },
        getBlogForEdit: {
            method: 'GET',
            path: '/api/panel/blog-for-edit/:blogId',
            responses: {
                200: c.type<blog.BlogEditDto>(),
            },
            pathParams: c.type<{ blogId: string }>(),
        },
        deleteBlog: {
            method: 'POST',
            path: '/api/panel/remove-blog',
            responses: {
                200: c.type<blog.DeleteBlogResult>(),
            },
            body: c.type<{ id: number }>(),
        },
        uploadBlogAsset: {
            method: 'POST',
            path: '/api/panel/upload-blog-asset',
            responses: {
                200: c.type<blog.UploadBlogAssetResult>(),
            },
            body: c.type<{ blogId: number, asset: File }>()
        },
        getBlogAssets: {
            method: 'GET',
            path: '/api/panel/blog-assets/:blogId',
            responses: {
                200: c.type<blog.BlogAssetsListItemDto[]>(),
            },
            pathParams: c.type<{ blogId: string }>(),
        },
        deleteBlogAsset: {
            method: 'POST',
            path: '/api/panel/remove-blog-asset',
            responses: {
                200: c.type<blog.DeleteBlogAssetResult>(),
            },
            body: c.type<{ id: number }>(),
        },
        changeBlogAssetAlt: {
            method: 'POST',
            path: '/api/panel/change-blog-asset-alt',
            responses: {
                200: c.type<blog.ChangeBlogAssetAltResult>(),
            },
            body: c.type<{ id: number; alt: string }>(),
        },
        getBlogVisits: {
            method: 'GET',
            path: '/api/panel/blog-stats/:start/:end/:blogId',
            responses: {
                200: c.type<blog.BlogVisitsDto>(),
            },
            pathParams: c.type<{ blogId: string; start: string; end: string }>(),
        },
        getMainBlogs: {
            method: 'GET',
            path: '/api/panel/main-blogs',
            responses: {
                200: c.type<blog.MainBlogsDto>(),
            },
        },
        changeMainBlogs: {
            method: 'POST',
            path: '/api/panel/change-main-blogs',
            responses: {
                200: c.type<blog.ChangeMainBlogsResult>(),
            },
            body: c.type<blog.MainBlogsDto>(),
        },
    },
    privateGallery: {
        getGalleriesList: {
            method: 'GET',
            path: '/api/panel/galleries-list',
            responses: {
                200: c.type<privateGallery.GalleryDto[]>(),
            },
        },
        getGalleryVisits: {
            method: 'GET',
            path: '/api/panel/gallery-stats/:start/:end/:galleryId',
            responses: {
                200: c.type<privateGallery.GalleryVisitsDto>(),
            },
            pathParams: c.type<{ galleryId: string; start: string; end: string }>(),
        },
        checkPasswordIsUnique: {
            method: 'GET',
            path: '/api/panel/gallery-password-unique/:password/:galleryId?',
            responses: {
                200: c.type<boolean>(),
            },
            pathParams: c.type<{ password: string, galleryId?: string }>(),
        },
        createGallery: {
            method: 'POST',
            path: '/api/panel/create-gallery',
            responses: {
                200: c.type<privateGallery.CreateGalleryResult>(),
            },
            body: c.type<privateGallery.GalleryEditDto>(),
        },
        getGalleryForEdit: {
            method: 'GET',
            path: '/api/panel/gallery-for-edit/:galleryId',
            responses: {
                200: c.type<privateGallery.GalleryEditDto>(),
            },
            pathParams: c.type<{ galleryId: string }>(),
        },
        editGallery: {
            method: 'POST',
            path: '/api/panel/edit-gallery',
            responses: {
                200: c.type<privateGallery.EditGalleryResult>(),
            },
            body: c.type<{ id: number; gallery: privateGallery.GalleryEditDto }>(),
        },
        deleteGallery: {
            method: 'POST',
            path: '/api/panel/remove-gallery',
            responses: {
                200: c.type<privateGallery.DeleteGalleryResult>(),
            },
            body: c.type<{ id: number }>(),
        },
        getGalleryEmails: {
            method: 'GET',
            path: '/api/panel/gallery-emails/:galleryId',
            responses: {
                200: c.type<privateGallery.GalleryEmailsDto>(),
            },
            pathParams: c.type<{ galleryId: string }>(),
        },
        notifySubscribers: {
            method: 'POST',
            path: '/api/panel/notify-subscribers',
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
        path: '/api/register-event',
        responses: {
            200: c.type<event.RegisterEventResult>(),
        },
        body: c.type<event.EventDto>(),
    },
    getEventsList: {
        method: 'GET',
        path: '/api/events-list',
        responses: {
            200: c.type<event.EventDto[]>(),
        },
    },
});

export const siteContract = c.router({
    blog: {
        getLastBlogs: {
            method: 'GET',
            path: '/api/last-blogs',
            responses: {
                200: c.type<siteBlog.BlogListItem[]>(),
            },
        },
        getBlogsList: {
            method: 'GET',
            path: '/api/blogs-list',
            responses: {
                200: c.type<siteBlog.BlogListItem[]>(),
            },
        },
        getBlog: {
            method: 'GET',
            path: '/api/blog/:alias',
            responses: {
                200: c.type<siteBlog.Blog>(),
            },
            pathParams: c.type<{ alias: string }>(),
        },
    },
    message: {
        send: {
            method: 'POST',
            path: '/api/send-message',
            responses: {
                200: c.type<siteMessage.SendResult>(),
            },
            body: c.type<siteMessage.Message>(),
        },
    },
    privateGallery: {
        subscribeForNotification: {
            method: 'POST',
            path: '/api/subscribe-for-notification',
            responses: {
                200: c.type<siteGallery.SubscribtionResult>(),
            },
            body: c.type<siteGallery.Subscription>(),
        },
        getGalleryUrl: {
            method: 'GET',
            path: '/api/private-gallery-url/:password',
            responses: {
                200: c.type<siteGallery.PrivateGalleryUrlCheckResult>(),
            },
            pathParams: c.type<{ password: string }>(),
        },
        viewGallery: {
            method: 'GET',
            path: '/galeria',
            responses: {
                200: c.otherResponse({ contentType: 'text/html', body: z.string() }),
            },
        },
        postViewGallery: {
            method: 'POST',
            path: '/galeria',
            responses: {
                200: c.otherResponse({ contentType: 'text/html', body: z.string() }),
            },
            body: c.type<{ galleryUrl: string; galleryId: number }>(),
        },
    },
    video: {
        getVideosList: {
            method: 'GET',
            path: '/api/videos-list',
            responses: {
                200: c.type<siteVideo.VideoListItem[]>(),
            },
        },
    },
    offer: {
        getOffersList: {
            method: 'GET',
            path: '/api/offer/get-offers-list',
            responses: {
                200: c.type<{ offer: siteOffer.OfferEntry, offers: siteOffer.OfferListItem[] }>(),
            },
        },
        getOffer: {
            method: 'GET',
            path: '/api/offer/get-offer',
            responses: {
                200: c.type<siteOffer.OfferEntry>(),
            },
            query: c.type<{ alias: string }>(),
        },
    }
});
