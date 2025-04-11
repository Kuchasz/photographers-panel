import type { CollectionConfig } from 'payload'
import { PRIVATE_GALLERY_PHOTO_SLUG } from '../collectionSlugs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const PrivateGalleryPhoto: CollectionConfig = {
  slug: PRIVATE_GALLERY_PHOTO_SLUG,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Galeria prywatna',
  },
  labels: {
    singular: {
      en: 'Gallery Photo',
      pl: 'Zdjęcie galerii',
    },
    plural: {
      en: 'Gallery Photos',
      pl: 'Zdjęcia galerii',
    },
  },
  upload: {
    staticDir: 'public/uploads/private-gallery-photo',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
        fit: 'cover',
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
    },
  ],
} 