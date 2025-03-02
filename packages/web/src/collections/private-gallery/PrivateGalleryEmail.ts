import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { PRIVATE_GALLERIES_SLUG } from '../collectionSlugs'

export const PrivateGalleryEmail: CollectionConfig = {
  slug: 'private-gallery-emails',
  admin: {
    useAsTitle: 'address',
    defaultColumns: ['address', 'privateGallery'],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'address',
      type: 'email',
      required: true,
      label: 'Email Address',
      unique: true,
    },
    {
      name: 'privateGallery',
      type: 'relationship',
      relationTo: PRIVATE_GALLERIES_SLUG,
      label: 'Private Gallery',
      required: true,
      hasMany: false,
    },
    {
      name: 'notified',
      type: 'checkbox',
      label: 'Notified',
      defaultValue: false,
    },
    {
      name: 'notifiedDate',
      type: 'date',
      label: 'Notified Date',
      admin: {
        condition: (data) => Boolean(data?.notified),
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set the notified date if notified is true and date is not set
        if (data.notified && !data.notifiedDate) {
          data.notifiedDate = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
