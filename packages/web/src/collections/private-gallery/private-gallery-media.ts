import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import { PRIVATE_GALLERY_MEDIA_SLUG } from '../collectionSlugs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const PrivateGalleryMedia: CollectionConfig = {
  slug: PRIVATE_GALLERY_MEDIA_SLUG,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Offers',
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
  },
  fields: [],
} 