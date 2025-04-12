import type { CollectionConfig, TextFieldSingleValidation } from 'payload'
import { revalidateVideos } from '~/lib/cache'
import { extractVideoId, getVideoInfo } from '~/lib/youtube'
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
        beforeChange: [
            async ({ data, operation }) => {
                if (operation === 'create' || operation === 'update') {
                    const videoId = extractVideoId(data.videoUrl)
                    if (videoId) {
                        const videoInfo = await getVideoInfo(videoId)
                        if (videoInfo) {
                            data.title = videoInfo.title
                            data.alias = videoInfo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                            data.desc = videoInfo.description
                            data.descshort = videoInfo.description.substring(0, 200) + (videoInfo.description.length > 200 ? '...' : '')
                        }
                    }
                }
                return data
            }
        ],
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
            name: 'videoUrl',
            label: {
                en: 'Video URL',
                pl: 'URL wideo',
            },
            type: 'text',
            required: true,
            validate: ((value) => {
                if (!value) return 'Video URL is required'
                if (typeof value === 'string' && !extractVideoId(value)) {
                    return 'Video URL must be a valid YouTube URL'
                }
                return true
            }) as TextFieldSingleValidation,
        },
        {
            name: 'title',
            type: 'text',
            label: {
                en: 'Title',
                pl: 'Tytuł',
            },
        },
        {
            name: 'alias',
            type: 'text',
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
        },
        {
            name: 'descshort',
            label: {
                en: 'Short Description',
                pl: 'Krótki opis',
            },
            type: 'textarea',
        }
    ],
}