import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { BLOG_ASSETS_SLUG, BLOGS_SLUG } from '../collectionSlugs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const BlogAsset: CollectionConfig = {
  slug: BLOG_ASSETS_SLUG,
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'url', 'blog'],
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/blog-assets'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
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
        height: 1024,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1440,
        height: 900,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // This will be auto-populated from the upload
            return data?.url
          },
        ],
      },
    },
    {
      name: 'blog',
      type: 'relationship',
      relationTo: BLOGS_SLUG,
      label: 'Related Blog',
      hasMany: false,
    },
  ],
}
