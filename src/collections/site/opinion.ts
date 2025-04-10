import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { OPINIONS_SLUG, OPINION_MEDIA_SLUG } from '../collectionSlugs'
import { revalidateOpinions } from '~/lib/cache'

export const Opinion: CollectionConfig = {
    slug: OPINIONS_SLUG,
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'author', 'rating', 'source', 'date'],
        group: 'Treść strony',
    },
    labels: {
        singular: {
            en: 'Opinion',
            pl: 'Opinia',
        },
        plural: {
            en: 'Opinions',
            pl: 'Opinie',
        },
    },
    access: {
        create: authenticated,
        read: () => true, // Allow public read access for opinions
        update: authenticated,
        delete: authenticated,
    },
    hooks: {
        beforeChange: [
            ({ data }) => {
                // Set the date if not provided
                if (!data.date) {
                    data.date = new Date().toISOString().split('T')[0]
                }
                return data
            },
        ],
        afterChange: [
            async () => {
                revalidateOpinions()
            }
        ],
        afterDelete: [
            async () => {
                revalidateOpinions()
            }
        ],
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
            name: 'author',
            type: 'text',
            required: true,
            label: {
                en: 'Author',
                pl: 'Autor',
            },
        },
        {
            name: 'content',
            type: 'textarea',
            required: true,
            label: {
                en: 'Content',
                pl: 'Treść',
            },
        },
        {
            name: 'media',
            type: 'relationship',
            relationTo: OPINION_MEDIA_SLUG,
            label: {
                en: 'Image',
                pl: 'Zdjęcie',
            },
            hasMany: false,
            admin: {
                description: 'Select an image for this testimonial',
            },
        },
        {
            name: 'rating',
            type: 'number',
            required: true,
            label: {
                en: 'Rating',
                pl: 'Ocena',
            },
            min: 1,
            max: 5,
            defaultValue: 5,
            admin: {
                step: 1,
            },
        },
        {
            name: 'source',
            type: 'select',
            required: true,
            label: {
                en: 'Source',
                pl: 'Źródło',
            },
            options: [
                {
                    label: 'Google',
                    value: 'google',
                },
                {
                    label: 'Facebook',
                    value: 'facebook',
                },
                {
                    label: 'PM',
                    value: 'pm',
                },
            ],
        },
        {
            name: 'date',
            type: 'date',
            required: true,
            label: {
                en: 'Date',
                pl: 'Data',
            },
            admin: {
                date: {
                    pickerAppearance: 'dayOnly',
                },
            },
            defaultValue: () => new Date().toISOString().split('T')[0],
        },
        {
            name: 'isPublished',
            type: 'checkbox',
            label: {
                en: 'Is Published',
                pl: 'Opublikowana',
            },
            defaultValue: true,
            admin: {
                position: 'sidebar',
            },
        },
    ],
} 