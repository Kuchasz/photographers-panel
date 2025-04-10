import { type CollectionConfig } from "payload";
import { PRIVATE_GALLERIES_SLUG } from "../collectionSlugs";

export const PrivateGalleryVisits: CollectionConfig = {
    slug: 'private-gallery-visits',
    admin: {
        group: 'Galeria prywatna',
    },
    labels: {
        singular: {
            en: 'Visit',
            pl: 'Wizyta',
        },
        plural: {
            en: 'Visits',
            pl: 'Wizyty',
        },
    },
    fields: [
        {
            name: 'ip',
            type: 'text',
            label: {
                en: 'IP Address',
                pl: 'Adres IP',
            },
        },
        {
            name: 'date',
            type: 'date',
            label: {
                en: 'Date',
                pl: 'Data',
            },
        },
        {
            name: 'userAgent',
            type: 'text',
            label: {
                en: 'User Agent',
                pl: 'Agent użytkownika',
            },
        },
        {
            name: 'gallery',
            type: 'relationship',
            relationTo: PRIVATE_GALLERIES_SLUG,
            hasMany: false,
            label: {
                en: 'Gallery',
                pl: 'Galeria',
            },
        },
    ],
}