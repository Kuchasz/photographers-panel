import type { CollectionConfig } from 'payload'
import { OFFER_MEDIA_SLUG } from '../collectionSlugs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const OfferMedia: CollectionConfig = {
  slug: OFFER_MEDIA_SLUG,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Treść strony',
    hidden: true,
  },
  labels: {
    singular: {
      en: 'Offer Media',
      pl: 'Media oferty',
    },
    plural: {
      en: 'Offer Media',
      pl: 'Media oferty',
    },
  },
  upload: {
    staticDir: path.resolve(dirname, '../../../../public/uploads/offer-media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    }
  ],
} 