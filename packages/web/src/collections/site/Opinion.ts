import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { OPINIONS_SLUG } from '../collectionSlugs'

export const Opinion: CollectionConfig = {
  slug: OPINIONS_SLUG,
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'source', 'date'],
  },
  labels: {
    singular: {
      en: 'Opinion',
      pl: 'Opinia',
    },
    plural: {
      en: 'Opinions',
      pl: 'Opinie',
    },
  },
  access: {
    create: authenticated,
    read: () => true, // Allow public read access for opinions
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Author',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Content',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      label: 'Rating',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: {
        step: 1,
      },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      label: 'Source',
      options: [
        {
          label: 'Google',
          value: 'google',
        },
        {
          label: 'Facebook',
          value: 'facebook',
        },
      ],
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
      defaultValue: () => new Date().toISOString().split('T')[0],
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Is Published',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set the date if not provided
        if (!data.date) {
          data.date = new Date().toISOString().split('T')[0]
        }
        return data
      },
    ],
  },
} 