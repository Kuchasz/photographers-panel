"use server";
import config from "@payload-config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { authenticateGallery, recordVisit } from "~/collections/private-gallery/private-gallery-actions";
import { getPrivateGalleryLoginPath, type PrivateGalleryLoginStatus } from "~/lib/private-gallery-login-status";

// Check if gallery exists with the given password
export async function loginToPrivateGallery(formData: FormData): Promise<void> {
    const password = formData.get('password') as string;
    let redirectPath: string = getPrivateGalleryLoginPath('error');

    if (!password) {
        redirect(getPrivateGalleryLoginPath('not-found'));
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

        const gallery = docs[0];

        if (!docs || docs.length === 0 || !gallery) {
            redirectPath = getPrivateGalleryLoginPath('not-found');
        } else {
            const headersList = await headers();

            const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
            const userAgent = headersList.get('user-agent') ?? 'unknown';

            await recordVisit(gallery.id, ip, userAgent);

            if (gallery.state === 'draft' || gallery.state === 'archived') {
                const unavailableStatus: PrivateGalleryLoginStatus = gallery.state;
                redirectPath = getPrivateGalleryLoginPath(unavailableStatus);
            } else if (gallery.state !== 'published') {
                redirectPath = getPrivateGalleryLoginPath('error');
            } else {
                const token = await authenticateGallery(gallery.id, ip);
                redirectPath = `/prywatna/${token.token}`;
            }

        }
    } catch (error) {
        console.error('Error checking gallery password:', error);
        redirectPath = getPrivateGalleryLoginPath('error');
    }

    redirect(redirectPath);
}
