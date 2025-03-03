import {
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
    lexicalEditor
} from "@payloadcms/richtext-lexical";
import { type CollectionConfig } from "payload";
import { OFFER_MEDIA_SLUG, OFFERS_SLUG } from "../collectionSlugs";

export const Offer: CollectionConfig = {
    slug: OFFERS_SLUG,
    admin: {
        useAsTitle: 'title',
        group: 'Offers',
    },
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
            name: 'content',
            type: 'richText',
            editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                    return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                        HorizontalRuleFeature(),
                    ]
                },

            })
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
            required: true
        },
        {
            name: 'photos',
            type: 'upload',
            relationTo: OFFER_MEDIA_SLUG,
            required: true,
            hasMany: true,
        },
        {
            name: 'tags',
            type: 'text',
            required: true,
        }
    ]
};