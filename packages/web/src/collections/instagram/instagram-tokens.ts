import { INSTAGRAM_TOKENS_SLUG } from '../collectionSlugs';
import type { CollectionConfig } from 'payload';

export const InstagramTokens: CollectionConfig = {
    slug: INSTAGRAM_TOKENS_SLUG,
    admin: {
        useAsTitle: 'label',
        defaultColumns: ['label', 'createdAt'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'label',
            type: 'text',
            required: true,
            defaultValue: 'Instagram Access Token',
        },
        {
            name: 'accessToken',
            type: 'text',
            required: true,
        },
    ],
};