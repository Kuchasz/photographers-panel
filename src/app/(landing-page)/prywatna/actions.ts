"use server";
import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { authenticateGallery, recordVisit } from "~/collections/private-gallery/private-gallery-actions";

type AuthenticationResult = {
    password: string;
    authenticated: boolean;
    isDirty: boolean;
    token?: string;
    galleryData?: {
        id: number;
        state: string;
        title: string;
        url: string;
        date: string;
    };
};

// Check if gallery exists with the given password
export async function authenticate(
    previousState: AuthenticationResult,
    formData: FormData
): Promise<AuthenticationResult> {
    const password = formData.get('password') as string;

    if (!password) {
        return { password: '', authenticated: false, isDirty: false };
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
            return { password: '', authenticated: false, isDirty: true };
        }

        const gallery = docs[0];

        if (!gallery) {
            return { password: '', authenticated: false, isDirty: true };
        }

        const headersList = await headers();

        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
        const userAgent = headersList.get('user-agent') ?? 'unknown';

        await recordVisit(gallery.id, ip, userAgent);

        const token = await authenticateGallery(gallery.id, ip);

        // Format the response with improved structure
        return {
            password,
            authenticated: true,
            token: token.token,
            galleryData: {
                id: gallery.id,
                state: gallery.state,
                title: gallery.title ?? '',
                url: gallery.directPath ?? '',
                date: gallery.date ?? '',
            },
            isDirty: true
        };
    } catch (error) {
        console.error('Error checking gallery password:', error);
        return { password: '', authenticated: false, isDirty: true };
    }
}