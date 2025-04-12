import type { CollectionConfig, TextFieldSingleValidation } from 'payload'
import { revalidateVideos } from '~/lib/cache'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { VIDEOS_SLUG } from '../collectionSlugs'

const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2] && match[2].length === 11) ? match[2] : null
}

const getVideoInfo = async (videoId: string) => {
    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
        const data = await response.json()
        return {
            title: data.title,
            description: data.description || '',
        }
    } catch (error) {
        console.error('Error fetching video info:', error)
        return null
    }
}

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