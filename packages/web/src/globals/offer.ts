import {
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
    lexicalEditor
} from "@payloadcms/richtext-lexical";
import { type GlobalConfig } from "payload";
import { OFFER_MEDIA_SLUG, OFFER_SLUG } from "../collections/collectionSlugs";

export const Offer: GlobalConfig = {
    slug: OFFER_SLUG,
    admin: {
        group: 'Treść strony',
    },
    label: {
        en: 'Offer',
        pl: 'Oferta',
    },
    fields: [
        {
            name: 'title',
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
            name: 'descShort',
            type: 'text',
            required: true,
        },
        {
            name: 'photo',
            type: 'upload',
            relationTo: OFFER_MEDIA_SLUG,
            required: true,
            hasMany: true,
        },
        {
            name: 'services',
            type: 'array',
            label: 'Services',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true
                },
                {
                    name: 'description',
                    type: 'text',
                    required: true
                },
                {
                    name: 'photo',
                    type: 'upload',
                    relationTo: OFFER_MEDIA_SLUG,
                    required: true
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
                }
            ]
        },
        {
            name: 'tags',
            type: 'text',
        }
    ]
}; 