"use server";
import config from "@payload-config";
import { PrivateGalleryState } from "@pp/api/dist/private-gallery";
import { type PrivateGalleryUrlCheckResult } from "@pp/api/dist/site/private-gallery";
import { getPayload } from "payload";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Map PayloadCMS state to PrivateGalleryState
const mapState = (state: string): PrivateGalleryState => {
    switch (state) {
        case 'draft':
            return PrivateGalleryState.NotReady;
        case 'published':
            return PrivateGalleryState.Available;
        case 'archived':
            return PrivateGalleryState.TurnedOff;
        default:
            return PrivateGalleryState.NotReady;
    }
};

// Check if gallery exists with the given password
export const checkGalleryPassword = async (password: string): Promise<PrivateGalleryUrlCheckResult> => {

    await wait(1000);

    if (!password) {
        return { gallery: undefined, blog: undefined };
    }

    try {
        // Initialize PayloadCMS client
        const payloadConfig = await config;
        const payload = await getPayload({ config: payloadConfig });

        // Find the gallery with the given password
        const { docs } = await payload.find({
            collection: 'private-galleries',
            where: {
                password: {
                    equals: password
                }
            },
            depth: 1 // To populate related blog if exists
        });

        if (!docs || docs.length === 0) {
            return { gallery: undefined, blog: undefined };
        }

        const gallery = docs[0];

        if (!gallery) {
            return { gallery: undefined, blog: undefined };
        }

        // Format the response to match the expected structure
        const result: PrivateGalleryUrlCheckResult = {
            gallery: {
                id: gallery.id,
                state: mapState(gallery.state),
                title: gallery.title ?? '',
                url: gallery.directPath ?? '',
                date: gallery.date ?? ''
            }
        };

        // Add blog details if available
        if (gallery.relatedBlog) {
            result.blog = {
                alias: gallery.relatedBlog.alias ?? '',
                title: gallery.relatedBlog.title ?? ''
            };
        }

        return result;
    } catch (error) {
        console.error('Error checking gallery password:', error);
        return { gallery: undefined, blog: undefined };
    }
};