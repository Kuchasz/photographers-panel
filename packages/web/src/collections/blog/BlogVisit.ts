import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { BLOG_VISITS_SLUG, BLOGS_SLUG } from '../collectionSlugs'

export const BlogVisit: CollectionConfig = {
  slug: BLOG_VISITS_SLUG,
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['ip', 'date', 'blog'],
  },
  access: {
    create: () => true, // Allow tracking visits without authentication
    read: authenticated,
    update: authenticated,
    delete: authenticated,
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
      label: 'Visit Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'blog',
      type: 'relationship',
      relationTo: BLOGS_SLUG,
      label: 'Related Blog',
      required: true,
      hasMany: false,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set the date if not provided
        if (!data.date) {
          data.date = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
