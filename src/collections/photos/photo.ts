import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import { PHOTOS_SLUG } from '../collectionSlugs'
import { revalidatePhotos } from '~/lib/cache'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Photo: CollectionConfig = {
    slug: PHOTOS_SLUG,
    labels: {
        singular: {
            en: 'Photo',
            pl: 'Zdjęcie',
        },
        plural: {
            en: 'Photos',
            pl: 'Zdjęcia',
        },
    },
    hooks: {
        afterChange: [
            async () => {
                revalidatePhotos()
            }
        ],
        afterDelete: [
            async () => {
                revalidatePhotos()
            }
        ]
    },
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'alt',
        group: 'Treść strony',
    },
    upload: {
        staticDir: 'public/uploads/photos',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 320,
                position: 'centre',
                fit: 'contain',
            },
            {
                name: 'big',
                width: 1920,
                height: 1920,
                position: 'centre',
                fit: 'inside'

            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: false,
        },
        {
            name: 'order',
            type: 'number',
            defaultValue: 0,
            admin: {
                description: 'Used for sorting photos (lower numbers appear first)',
            },
        },
    ],
} 