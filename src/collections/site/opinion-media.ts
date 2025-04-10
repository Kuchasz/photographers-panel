import type { CollectionConfig } from 'payload'
import { OPINION_MEDIA_SLUG } from '../collectionSlugs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const OpinionMedia: CollectionConfig = {
  slug: OPINION_MEDIA_SLUG,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Treść strony',
  },
  labels: {
    singular: {
      en: 'Opinion Media',
      pl: 'Media opinii',
    },
    plural: {
      en: 'Opinion Media',
      pl: 'Media opinii',
    },
  },
  upload: {
    staticDir: path.resolve(dirname, '../../../public/uploads/opinion-media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 600,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1200,
        height: 1200,
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
      label: {
        en: 'Alternative Text',
        pl: 'Tekst alternatywny',
      },
    }
  ],
} 