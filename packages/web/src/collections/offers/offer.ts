import { type CollectionConfig } from "payload"
import { OFFER_MEDIA_SLUG, OFFERS_SLUG } from "../collectionSlugs";

export const Offer: CollectionConfig = {
    slug: OFFERS_SLUG,
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'alias',
            type: 'text',
            required: true,
        },
        {
            name: 'desc',
            type: 'textarea',
            required: true,
        },
        {
            name: 'descshort',
            type: 'text',
            required: true,
        },
        {
            name: 'photo',
            type: 'upload',
            relationTo: OFFER_MEDIA_SLUG,
            required: true,
        },
        {
            name: 'tags',
            type: 'text',
            required: true,
        }
    ]
};