import { INSTAGRAM_TOKENS_SLUG } from '../collectionSlugs';
import type { CollectionConfig } from 'payload';
import { revalidateInstagram } from '~/lib/cache';
export const InstagramTokens: CollectionConfig = {
    slug: INSTAGRAM_TOKENS_SLUG,
    admin: {
        useAsTitle: 'label',
        defaultColumns: ['label', 'createdAt'],
    },
    access: {
        read: () => true,
    },
    hooks: {
        afterChange: [
            async () => {
                revalidateInstagram()
            }
        ],
        afterDelete: [
            async () => {
                revalidateInstagram()
            }
        ],
    },
    fields: [
        {
            name: 'label',
            type: 'text',
            required: true,
            defaultValue: 'Instagram Access Token',
        },
        {
            name: 'expiresAt',
            type: 'date',
            required: true,
            admin: {
                description: 'When this token expires',
            },
        },
        {
            name: 'accessToken',
            type: 'text',
            required: true,
        },
    ],
};