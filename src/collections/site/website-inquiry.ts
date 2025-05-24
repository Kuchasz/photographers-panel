import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { WEBSITE_INQUIRIES_SLUG } from '../collectionSlugs'
import { addEmailToBlacklist } from '~/lib/blacklist'

export const WebsiteInquiry: CollectionConfig = {
  slug: WEBSITE_INQUIRIES_SLUG,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'weddingDate', 'date', 'isBlacklisted'],
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
      name: 'isBlacklisted',
      type: 'checkbox',
      label: {
        en: 'Blacklist Email',
        pl: 'Zablokuj email',
      },
      admin: {
        description: {
          en: 'Check this to add the email to the blacklist',
          pl: 'Zaznacz, aby dodać email do listy zablokowanych',
        },
        position: 'sidebar',
      },
      defaultValue: false,
    },
    {
      name: 'blacklistReason',
      type: 'select',
      label: {
        en: 'Blacklist Reason',
        pl: 'Powód blokady',
      },
      options: [
        {
          label: {
            en: 'Spam',
            pl: 'Spam',
          },
          value: 'spam',
        },
        {
          label: {
            en: 'Invalid Email',
            pl: 'Nieprawidłowy email',
          },
          value: 'invalid',
        },
        {
          label: {
            en: 'User Request',
            pl: 'Prośba użytkownika',
          },
          value: 'user-request',
        },
        {
          label: {
            en: 'Other',
            pl: 'Inne',
          },
          value: 'other',
        },
      ],
      admin: {
        condition: (data) => Boolean(data.isBlacklisted),
        position: 'sidebar',
      },
      defaultValue: 'spam',
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
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Check if isBlacklisted was just set to true
        if (doc.isBlacklisted && !previousDoc?.isBlacklisted && doc.email) {
          try {
            await addEmailToBlacklist(
              req.payload,
              doc.email, 
              doc.blacklistReason || 'spam',
              `Added from website inquiry: ${doc.name}`
            )
            console.log('Email added to blacklist:', doc.email)
          } catch (error) {
            console.error('Failed to add email to blacklist:', error)
          }
        }
      },
    ],
  },
} 