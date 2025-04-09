'use server'

import { getPayload } from "payload";
import payloadConfig from "~/payload.config";
import { INSTAGRAM_TOKENS_SLUG } from '~/collections/collectionSlugs';
import { fetchMediaList, fetchMediaDetails, type InstagramPost } from "~/lib/instagram";
import { unstable_cache } from 'next/cache';

/**
 * Fetches the Instagram token from the database using Payload API
 */
async function getInstagramToken(): Promise<string> {
    const payload = await getPayload({ config: payloadConfig });

    const currentDate = new Date().toISOString();
    const tokens = await payload.find({
        collection: INSTAGRAM_TOKENS_SLUG,
        limit: 1,
        sort: '-createdAt',
        where: {
            expiresAt: {
                greater_than: currentDate
            }
        }
    });

    if (!tokens.docs || tokens.docs.length === 0) {
        throw new Error('No valid Instagram tokens found (all expired or none exist)');
    }

    const token = tokens.docs[0];

    if (!token) {
        throw new Error('No valid Instagram tokens found (all expired or none exist)');
    }

    return token.accessToken;
}

/**
 * Internal function to fetch Instagram posts without caching
 */
async function fetchInstagramPosts(limit: number): Promise<InstagramPost[]> {
    let accessToken: string;

    try {
        accessToken = await getInstagramToken();
        console.log('Using valid Instagram token');
    } catch (error) {
        console.error('Error fetching Instagram token:', error);
        if (error instanceof Error && error.message.includes('expired')) {
            console.warn('All Instagram tokens have expired. Please update tokens.');
            return [];
        }
        accessToken = process.env.INSTAGRAM_ACCESS_TOKEN ?? 'YOUR_INSTAGRAM_ACCESS_TOKEN';
    }

    const usingMockData = accessToken === 'YOUR_INSTAGRAM_ACCESS_TOKEN';

    if (usingMockData) {
        console.warn('Using mock Instagram data. Set up valid Instagram credentials for real data.');
        return [];
    }

    const mediaItems = await fetchMediaList(limit, accessToken);

    if (!mediaItems.length) {
        console.warn('No Instagram media items found');
        return [];
    }

    const posts = await fetchMediaDetails(mediaItems, accessToken);
    return posts;
}

/**
 * Main function to fetch Instagram posts for the footer
 * Uses Next.js cache to limit API calls to once per hour
 */
export const getInstagramPostsForFooter = unstable_cache(
    async () => {
        try {
            return await fetchInstagramPosts(6);
        } catch (error) {
            console.error('Error fetching Instagram posts:', error);
            console.warn('Returning empty array due to error');
            return [];
        }
    },
    ['instagram-posts-footer'],
    {
        revalidate: 3600,
        tags: ['instagram-posts']
    }
); 