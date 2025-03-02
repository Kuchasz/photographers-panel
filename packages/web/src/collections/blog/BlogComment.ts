import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { BLOG_COMMENTS_SLUG, BLOGS_SLUG } from '../collectionSlugs'

export const BlogComment: CollectionConfig = {
  slug: BLOG_COMMENTS_SLUG,
  admin: {
    useAsTitle: 'userName',
    defaultColumns: ['userName', 'date', 'state', 'blog'],
  },
  access: {
    create: () => true, // Allow anyone to create comments
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'userName',
      type: 'text',
      required: true,
      label: 'User Name',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment Content',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'state',
      type: 'select',
      required: true,
      label: 'State',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
      ],
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
