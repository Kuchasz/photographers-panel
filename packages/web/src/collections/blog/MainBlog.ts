import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { BLOGS_SLUG, MAIN_BLOGS_SLUG } from '../collectionSlugs'

export const MainBlog: CollectionConfig = {
  slug: MAIN_BLOGS_SLUG,
  admin: {
    useAsTitle: 'kind',
    defaultColumns: ['kind', 'blog'],
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      label: 'Kind',
      options: [
        {
          label: 'Featured',
          value: 'featured',
        },
        {
          label: 'Pinned',
          value: 'pinned',
        },
        {
          label: 'Highlighted',
          value: 'highlighted',
        },
      ],
    },
    {
      name: 'blog',
      type: 'relationship',
      relationTo: BLOGS_SLUG,
      label: 'Blog',
      required: true,
      hasMany: false,
    },
  ],
}
