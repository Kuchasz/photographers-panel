import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { WEBSITE_INQUIRIES_SLUG } from '../collectionSlugs'

export const WebsiteInquiry: CollectionConfig = {
  slug: WEBSITE_INQUIRIES_SLUG,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'weddingDate', 'date'],
    group: 'Monitoring',
  },
  labels: {
    singular: {
      en: 'Website Inquiry',
      pl: 'Zapytanie ze strony',
    },
    plural: {
      en: 'Website Inquiries',
      pl: 'Zapytania ze strony',
    },
  },
  access: {
    create: () => false, // Allow inquiries without authentication
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        en: 'Name',
        pl: 'Imię',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: {
        en: 'Email',
        pl: 'Email',
      },
    },
    {
      name: 'weddingDate',
      type: 'text',
      label: {
        en: 'Wedding Date',
        pl: 'Data ślubu',
      },
    },
    {
      name: 'weddingPlace',
      type: 'text',
      label: {
        en: 'Wedding Place',
        pl: 'Miejsce ślubu',
      },
    },
    {
      name: 'weddingVenue',
      type: 'text',
      label: {
        en: 'Wedding Venue',
        pl: 'Miejsce przyjęcia',
      },
    },
    {
      name: 'howDidYouHear',
      type: 'text',
      label: {
        en: 'How did you hear about us',
        pl: 'Skąd się o nas dowiedziałeś',
      },
    },
    {
      name: 'additionalDetails',
      type: 'textarea',
      label: {
        en: 'Additional Details',
        pl: 'Dodatkowe informacje',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: {
        en: 'Date',
        pl: 'Data',
      },
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
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