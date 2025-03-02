import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { BLOGS_SLUG } from '../collectionSlugs'

export const Blog: CollectionConfig = {
  slug: BLOGS_SLUG,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'alias', 'date', 'isHidden'],
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'alias',
      type: 'text',
      required: true,
      label: 'Alias',
      unique: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Tags',
    },
    {
      name: 'isHidden',
      type: 'checkbox',
      label: 'Is Hidden',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'mainBlogAsset',
      type: 'group',
      label: 'Main Blog Asset',
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Alt Text',
        },
        {
          name: 'imageUrl',
          type: 'text',
          required: true,
          label: 'Image URL',
          admin: {
            description: 'URL to the main image for this blog post',
          },
        },
      ],
    },
    {
      name: 'assets',
      type: 'array',
      label: 'Blog Assets',
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Alt Text',
        },
        {
          name: 'imageUrl',
          type: 'text',
          required: true,
          label: 'Image URL',
          admin: {
            description: 'URL to an image for this blog post',
          },
        },
      ],
    },
    {
      name: 'comments',
      type: 'array',
      label: 'Comments',
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
      ],
    },
    {
      name: 'visits',
      type: 'array',
      label: 'Blog Visits',
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
      ],
    },
    {
      name: 'mainBlogStatus',
      type: 'group',
      label: 'Main Blog Status',
      fields: [
        {
          name: 'kind',
          type: 'select',
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
          name: 'isMainBlog',
          type: 'checkbox',
          label: 'Is Main Blog',
          defaultValue: false,
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
