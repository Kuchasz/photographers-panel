"use server"
import { getPayload } from "payload";
import config from '~/payload.config';
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_MEDIA_SLUG, PRIVATE_GALLERY_VISITS_SLUG } from "../collectionSlugs";

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

export const recordImageDownload = async (galleryId: string, mediaId: string, ip: string) => {
    const payload = await getPayload({ config });

    const media = await payload.findByID({
        collection: PRIVATE_GALLERY_MEDIA_SLUG,
        id: mediaId,
    });

    const downloads = media.downloads ?? [];
    media.downloads = [
        ...downloads,
        {
            ip,
            date: new Date().toISOString(),
        },
    ];

    await payload.update({
        collection: PRIVATE_GALLERY_MEDIA_SLUG,
        id: mediaId,
        data: {
            downloads: media.downloads,
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