import { INSTAGRAM_TOKENS_SLUG } from '../collectionSlugs';
import type { CollectionConfig } from 'payload';
import { revalidateInstagram } from '~/lib/cache';
export const InstagramTokens: CollectionConfig = {
    slug: INSTAGRAM_TOKENS_SLUG,
    admin: {
        useAsTitle: 'label',
        defaultColumns: ['label', 'createdAt'],
        group: 'Ustawienia',
    },
    access: {
        read: () => true,
    },
    labels: {
        singular: {
            en: 'Instagram Token',
            pl: 'Token Instagram',
        },
        plural: {
            en: 'Instagram Tokens',
            pl: 'Tokeny Instagram',
        },
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
            label: {
                en: 'Label',
                pl: 'Etykieta',
            },
        },
        {
            name: 'expiresAt',
            type: 'date',
            required: true,
            label: {
                en: 'Expires At',
                pl: 'Wygasa',
            },
            admin: {
                description: 'When this token expires',
            },
        },
        {
            name: 'accessToken',
            type: 'text',
            required: true,
            label: {
                en: 'Access Token',
                pl: 'Token dostępu',
            },
        },
    ],
};