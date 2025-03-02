import type { CollectionConfig } from 'payload'
import { OFFER_MEDIA_SLUG } from '../collectionSlugs'

export const OfferMedia: CollectionConfig = {
  slug: OFFER_MEDIA_SLUG,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Offers',
  },
  upload: {
    staticDir: 'offer-media',
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