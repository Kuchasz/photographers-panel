import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_AUTH_TOKENS_SLUG } from '../collectionSlugs'

export const PrivateGalleryAuthTokens: CollectionConfig = {
    slug: PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
    admin: {
        useAsTitle: 'token',
        defaultColumns: ['token', 'gallery', 'ipAddress', 'expiresAt', 'createdAt'],
        group: 'Galeria prywatna'
    },
    labels: {
        singular: {
            en: 'Auth Token',
            pl: 'Token dostępu',
        },
        plural: {
            en: 'Auth Tokens',
            pl: 'Tokeny dostępu',
        },
    },
    access: {
        create: authenticated,
        read: authenticated,
        update: authenticated,
        delete: authenticated,
    },
    fields: [
        {
            name: 'token',
            type: 'text',
            required: true,
            label: {
                en: 'Token',
                pl: 'Token',
            },
        },
        {
            name: 'gallery',
            type: 'relationship',
            required: true,
            label: {
                en: 'Gallery',
                pl: 'Galeria',
            },
            relationTo: PRIVATE_GALLERIES_SLUG,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'ipAddress',
            type: 'text',
            required: true,
            label: {
                en: 'IP Address',
                pl: 'Adres IP',
            },
            admin: {
                position: 'sidebar',
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
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'createdAt',
            type: 'date',
            required: true,
            label: {
                en: 'Created At',
                pl: 'Utworzono',
            },
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ data, req }) => {
                // Set createdAt timestamp if it's a new document
                if (!data.createdAt) {
                    data.createdAt = new Date().toISOString()
                }

                // Set IP address from request
                if (!data.ipAddress) {
                    // Default to unknown
                    let ipAddress = 'unknown'

                    // Safely check if headers exist and if the get method is available
                    if (req && req.headers && typeof req.headers.get === 'function') {
                        const forwardedHeader = req.headers.get('x-forwarded-for')

                        if (forwardedHeader) {
                            // Get the first IP if multiple are present (comma-separated)
                            const ips = String(forwardedHeader).split(',')
                            if (ips.length > 0) {
                                ipAddress = ips[0]?.trim() ?? 'unknown'
                            }
                        }
                    }

                    data.ipAddress = ipAddress
                }

                return data
            },
        ],
    },
    // By default, tokens expire after 24 hours if not otherwise specified
    timestamps: true,
} 