import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { EVENTS_SLUG } from '../collectionSlugs'

export const SiteEvent: CollectionConfig = {
  slug: EVENTS_SLUG,
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'user', 'occuredOn'],
  },
  access: {
    create: () => true, // Allow event tracking without authentication
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'user',
      type: 'text',
      label: 'User',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Event Type',
      options: [
        {
          label: 'Login',
          value: 'login',
        },
        {
          label: 'Logout',
          value: 'logout',
        },
        {
          label: 'View',
          value: 'view',
        },
        {
          label: 'Create',
          value: 'create',
        },
        {
          label: 'Update',
          value: 'update',
        },
        {
          label: 'Delete',
          value: 'delete',
        },
      ],
    },
    {
      name: 'occuredOn',
      type: 'date',
      required: true,
      label: 'Occured On',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'details',
      type: 'json',
      label: 'Event Details',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set the date if not provided
        if (!data.occuredOn) {
          data.occuredOn = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
