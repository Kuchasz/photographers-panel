"use server"
import { getPayload } from "payload";
import config from '~/payload.config'
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_VISITS_SLUG } from "../collectionSlugs";
import { type PrivateGalleryMedia } from "~/payload-types";

export const recordVisit = async (galleryId: number, ip: string, userAgent: string) => {
    const payload = await getPayload({ config });

    // Find the gallery
    const gallery = await payload.findByID({
        collection: PRIVATE_GALLERIES_SLUG,
        id: galleryId,
    });

    // Add the visit to the gallery's visits array
    // const visits = gallery.galleryVisits ?? [];

    await payload.create({
        collection: PRIVATE_GALLERY_VISITS_SLUG,
        data: {
            ip,
            date: new Date().toISOString(),
            gallery: gallery,
        },
    });
};

export const recordImageDownload = async (galleryId: string, mediaIndex: number, ip: string) => {
    const payload = await getPayload({ config });

    // Find the gallery
    const gallery = await payload.findByID({
        collection: PRIVATE_GALLERIES_SLUG,
        id: galleryId,
    });

    // Get the current media item
    const galleryMedia = gallery.galleryMedia as PrivateGalleryMedia[];
    const mediaItem = galleryMedia?.[mediaIndex];

    if (!mediaItem) return;

    // Add the download to the media's downloads array
    const downloads = mediaItem.downloads ?? [];
    galleryMedia[mediaIndex] = {
        ...mediaItem,
        downloads: [
            ...downloads,
            {
                ip,
                date: new Date().toISOString(),
            },
        ],
    };

    // Update the gallery with the new media array
    await payload.update({
        collection: PRIVATE_GALLERIES_SLUG,
        id: galleryId,
        data: {
            galleryMedia,
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