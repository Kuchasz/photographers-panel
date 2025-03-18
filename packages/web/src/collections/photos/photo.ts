import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Photo: CollectionConfig = {
    slug: 'photos',
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
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'alt',
        group: 'Treść strony',
    },
    upload: {
        staticDir: path.resolve(dirname, '../../public/photos'),
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