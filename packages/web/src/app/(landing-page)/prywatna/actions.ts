"use server";
import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { recordVisit } from "~/collections/private-gallery/private-gallery-actions";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Check if gallery exists with the given password
export const checkGalleryPassword = async (password: string) => {

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

        const headersList = await headers();

        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
        const userAgent = headersList.get('user-agent') ?? 'unknown';

        await recordVisit(gallery.id, ip, userAgent);

        // Format the response to match the expected structure
        const result = {
            gallery: {
                id: gallery.id,
                state: gallery.state,
                title: gallery.title ?? '',
                url: gallery.directPath ?? '',
                date: gallery.date ?? ''
            }
        };

        return result;
    } catch (error) {
        console.error('Error checking gallery password:', error);
        return { gallery: undefined, blog: undefined };
    }
};