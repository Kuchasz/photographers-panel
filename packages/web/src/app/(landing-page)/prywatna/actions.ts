"use server";
import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { authenticateGallery, recordVisit } from "~/collections/private-gallery/private-gallery-actions";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type AuthentitaceFormState = {
    password: string;
    gallery: {
        id: number;
        state: string;
        title: string;
        url: string;
        date: string;
        token: string;
    } | undefined;
};

// Check if gallery exists with the given password
export async function authenticate(previosState: AuthentitaceFormState, formData: FormData): Promise<AuthentitaceFormState> {
    const password = formData.get('password') as string;

    await wait(1000);

    if (!password) {
        return { password: '', gallery: undefined };
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
            return { password: '', gallery: undefined };
        }

        const gallery = docs[0];

        if (!gallery) {
            return { password: '', gallery: undefined };
        }

        const headersList = await headers();

        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
        const userAgent = headersList.get('user-agent') ?? 'unknown';

        await recordVisit(gallery.id, ip, userAgent);

        const token = await authenticateGallery(gallery.id, ip);

        // Format the response to match the expected structure
        const result = {
            password: password,
            gallery: {
                id: gallery.id,
                state: gallery.state,
                title: gallery.title ?? '',
                url: gallery.directPath ?? '',
                date: gallery.date ?? '',
                token: token.token
            }
        };

        return result;
    } catch (error) {
        console.error('Error checking gallery password:', error);
        return { password: '', gallery: undefined };
    }
}