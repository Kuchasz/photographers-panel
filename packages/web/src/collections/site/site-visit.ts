import { type CollectionConfig, type TextFieldSingleValidation } from 'payload'
import { authenticated } from '../../access/authenticated'
import { SITE_VISITS_SLUG } from '../collectionSlugs'

export const SiteVisit: CollectionConfig = {
  slug: SITE_VISITS_SLUG,
  admin: {
    useAsTitle: 'ip',
    defaultColumns: ['ip', 'date'],
  },
  labels: {
    singular: {
      en: 'Site Visit',
      pl: 'Wizyta na Stronie',
    },
    plural: {
      en: 'Site Visits',
      pl: 'Wizyty na Stronie',
    },
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
      validate: ((value) => {
        console.log('value', value)

        if (!value) {
          return 'Please enter an IP address'
        }

        // IPv4 and IPv6 regex pattern
        const ipv4Regex =
          /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})$/

        if (!ipv4Regex.test(value)) {
          return 'Please enter a valid IP address'
        }

        console.log('seems fine.')

        return true
      }) as TextFieldSingleValidation,
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
    {
      name: 'referrer',
      type: 'text',
      label: 'Referrer',
    },
    {
      name: 'path',
      type: 'text',
      label: 'Path',
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
