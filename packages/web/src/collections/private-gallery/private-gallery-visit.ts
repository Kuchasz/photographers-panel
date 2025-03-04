import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_VISITS_SLUG } from '../collectionSlugs'

export const PrivateGalleryVisit: CollectionConfig = {
  slug: PRIVATE_GALLERY_VISITS_SLUG,
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['ip', 'date', 'privateGallery'],
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
      name: 'privateGallery',
      type: 'relationship',
      relationTo: PRIVATE_GALLERIES_SLUG,
      label: 'Private Gallery',
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
