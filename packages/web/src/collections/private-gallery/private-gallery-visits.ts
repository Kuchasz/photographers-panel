import { type CollectionConfig } from "payload";
import { PRIVATE_GALLERIES_SLUG } from "../collectionSlugs";

export const PrivateGalleryVisits: CollectionConfig = {
    slug: 'private-gallery-visits',
    fields: [
        {
            name: 'ip',
            type: 'text',
        },
        {
            name: 'date',
            type: 'date',
        },
        {
            name: 'gallery',
            type: 'relationship',
            relationTo: PRIVATE_GALLERIES_SLUG,
            hasMany: false,
        },
    ],
}