import { getPayload } from "payload";
import config from '~/payload.config'
import { PRIVATE_GALLERIES_SLUG } from "../collectionSlugs";

export const recordVisit = async (galleryId: string, ip: string, userAgent: string) => {
    const payload = await getPayload({ config });

    // Find the gallery
    const gallery = await payload.findByID({
        collection: PRIVATE_GALLERIES_SLUG,
        id: galleryId,
    });

    // Add the visit to the gallery's visits array
    const visits = gallery.visits ?? [];
    await payload.update({
        collection: PRIVATE_GALLERIES_SLUG,
        id: galleryId,
        data: {
            visits: [
                ...visits,
                {
                    ip,
                    date: new Date().toISOString(),
                    userAgent
                },
            ],
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
    const galleryMedia = gallery.galleryMedia;
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