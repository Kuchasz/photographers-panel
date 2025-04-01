"use server"
import { getPayload } from "payload";
import { type PrivateGalleryAuthToken } from "~/payload-types";
import config from '~/payload.config';
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_AUTH_TOKENS_SLUG, PRIVATE_GALLERY_MEDIA_DOWNLOADS_SLUG, PRIVATE_GALLERY_VISITS_SLUG } from "../collectionSlugs";

export const recordVisit = async (galleryId: number, ip: string, userAgent: string) => {
    const payload = await getPayload({ config });

    // Create a new visit record
    await payload.create({
        collection: PRIVATE_GALLERY_VISITS_SLUG,
        data: {
            ip,
            date: new Date().toISOString(),
            gallery: galleryId,
            userAgent,
        },
    });
};

export const recordImageDownload = async (galleryId: number, mediaId: string, ip: string, tokenId?: number, userAgent?: string) => {
    const payload = await getPayload({ config });

    const tokens = await payload.find({
        collection: PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
        where: {
            token: {
                equals: tokenId,
            },
        },
    });

    const token = tokens.docs[0];

    await payload.create({
        collection: PRIVATE_GALLERY_MEDIA_DOWNLOADS_SLUG,
        data: {
            mediaId,
            gallery: galleryId,
            token: (token as unknown as PrivateGalleryAuthToken),
            ip,
            date: new Date().toISOString(),
            userAgent: userAgent ?? '',
        },
    });
}

export const getGalleryVisits = async (galleryId: string) => {
    const payload = await getPayload({ config });
    const gallery = await payload.findByID({
        collection: PRIVATE_GALLERIES_SLUG,
        id: galleryId,
    });

    return gallery.galleryVisits;
}

export const authenticateGallery = async (galleryId: number, ip: string) => {
    const payload = await getPayload({ config });
    const gallery = await payload.findByID({
        collection: PRIVATE_GALLERIES_SLUG,
        id: galleryId,
    });

    const token = `${Math.random().toString(36).substring(2, 24)}${Math.random().toString(36).substring(2, 24)}`;

    return await payload.create({
        collection: PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
        data: {
            token,
            gallery,
            expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
            ipAddress: ip,
        },
    });
}

export const validateToken = async (token: string, ip: string) => {
    const payload = await getPayload({ config });

    const authtokens = await payload.find({
        collection: PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
        where: {
            token: {
                equals: token,
            },
            ipAddress: {
                equals: ip,
            },
        },
    });

    const authtoken = authtokens.docs[0];

    //token not found
    if (!authtoken) {
        return false;
    }

    //token expired
    if (authtoken.expiresAt < new Date().toISOString()) {
        return false;
    }

    return true;
}