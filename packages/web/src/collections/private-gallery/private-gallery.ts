import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_MEDIA_SLUG } from '../collectionSlugs'
import { authenticatedOrPublished } from '~/access/authenticatedOrPublished'

export const PrivateGallery: CollectionConfig = {
  slug: PRIVATE_GALLERIES_SLUG,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'state'],
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
      defaultValue: () => new Date(),
    },
    {
      name: 'state',
      type: 'select',
      required: true,
      label: 'State',
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'password',
      type: 'text',
      required: true,
      label: 'Password',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'directPath',
      type: 'text',
      label: 'Direct Path',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
    {
      name: 'media',
      type: 'array',
      label: 'Gallery Media',
      required: true,
      fields: [
        {
          name: 'media',
          type: 'relationship',
          relationTo: PRIVATE_GALLERY_MEDIA_SLUG,
          required: true,
          label: 'Media',
          admin: {
            description: 'Select media from the media collection',
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
    },
    {
      name: 'visits',
      type: 'array',
      label: 'Gallery Visits',
      admin: {
        description: 'Record of visits to this gallery',
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
          name: 'userAgent',
          type: 'text',
          label: 'User Agent',
        },
      ],
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
  }
}