import type { CollectionConfig, TextFieldSingleValidation } from 'payload'
import { revalidateVideos } from '~/lib/cache'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { VIDEOS_SLUG } from '../collectionSlugs'

export const Video: CollectionConfig = {
    slug: VIDEOS_SLUG,
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'alias', 'updatedAt'],
        group: 'Treść strony',
    },
    labels: {
        singular: {
            en: 'Video',
            pl: 'Wideo',
        },
        plural: {
            en: 'Videos',
            pl: 'Wideo',
        },
    },
    defaultSort: 'order',
    hooks: {
        afterChange: [
            async () => {
                revalidateVideos()
            }
        ],
        afterDelete: [
            async () => {
                revalidateVideos()
            }
        ]
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: {
                en: 'Title',
                pl: 'Tytuł',
            },
        },
        {
            name: 'alias',
            type: 'text',
            required: true,
            unique: true,
            label: {
                en: 'Alias',
                pl: 'Alias',
            },
        },
        {
            name: 'order',
            type: 'number',
            label: {
                en: 'Display Order',
                pl: 'Kolejność wyświetlania',
            },
            admin: {
                position: 'sidebar',
                description: 'Used for manual sorting of videos',
            },
            defaultValue: 0,
        },
        {
            name: 'desc',
            label: {
                en: 'Description',
                pl: 'Opis',
            },
            type: 'textarea',
            required: true,
        },
        {
            name: 'descshort',
            label: {
                en: 'Short Description',
                pl: 'Krótki opis',
            },
            type: 'textarea',
            required: true,
        },
        {
            name: 'videoUrl',
            label: {
                en: 'Video URL',
                pl: 'URL wideo',
            },
            type: 'text',
            required: true,
            validate: ((value) => {
                if (!value) return 'Video URL is required'
                if (
                    typeof value === 'string' &&
                    !value.includes('youtube.com/embed/')
                ) {
                    return 'Video URL must be a valid YouTube embed URL like https://www.youtube.com/embed/some_video_id'
                }
                return true
            }) as TextFieldSingleValidation,
        }
    ],
}