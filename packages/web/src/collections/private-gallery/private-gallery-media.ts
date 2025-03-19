import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_MEDIA_SLUG } from '../collectionSlugs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const PrivateGalleryMedia: CollectionConfig = {
  slug: PRIVATE_GALLERY_MEDIA_SLUG,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Galeria prywatna',
  },
  labels: {
    singular: {
      en: 'Private Gallery Media',
      pl: 'Media galerii prywatnej',
    },
    plural: {
      en: 'Private Gallery Media',
      pl: 'Media galerii prywatnej',
    },
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/private-gallery'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        position: 'centre',
        fit: 'contain',
      },
      {
        name: 'big',
        width: 1920,
        height: 1920,
        position: 'centre',
        fit: 'inside'
      },
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    bulkUpload: true
  },
  fields: [
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: PRIVATE_GALLERIES_SLUG,
      required: true,
      hasMany: false,
      label: 'Private Gallery',
      admin: {
        description: 'The gallery this media belongs to',
        position: 'sidebar'
      },
    },
    {
      name: 'downloads',
      type: 'array',
      label: 'Downloads',
      admin: {
        description: 'Record of downloads for this media',
      },
      fields: [
        {
          name: 'ip',
          type: 'text',
          required: true,
          label: 'IP Address',
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Download Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          defaultValue: () => new Date(),
        },
      ],
    },
  ],
} 