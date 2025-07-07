import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { BLACKLISTED_EMAILS_SLUG } from '../collectionSlugs'

export const BlacklistedEmails: CollectionConfig = {
  slug: BLACKLISTED_EMAILS_SLUG,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'reason', 'createdAt'],
    group: 'Monitoring',
  },
  labels: {
    singular: {
      en: 'Blacklisted Email',
      pl: 'Zablokowany email',
    },
    plural: {
      en: 'Blacklisted Emails',
      pl: 'Zablokowane emaile',
    },
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: {
        en: 'Email Address',
        pl: 'Adres email',
      },
      admin: {
        description: {
          en: 'Email address to blacklist from receiving notifications',
          pl: 'Adres email do zablokowania przed otrzymywaniem powiadomień',
        },
      },
    },
    {
      name: 'reason',
      type: 'select',
      required: true,
      label: {
        en: 'Reason',
        pl: 'Powód',
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
            en: 'Bot Detected',
            pl: 'Wykryty bot',
          },
          value: 'bot',
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
            en: 'Bounced Email',
            pl: 'Odbity email',
          },
          value: 'bounced',
        },
        {
          label: {
            en: 'Other',
            pl: 'Inne',
          },
          value: 'other',
        },
      ],
      defaultValue: 'spam',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        en: 'Notes',
        pl: 'Notatki',
      },
      admin: {
        description: {
          en: 'Additional notes about this blacklisted email',
          pl: 'Dodatkowe notatki o tym zablokowanym emailu',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Normalize email to lowercase
        if (data.email) {
          data.email = data.email.toLowerCase().trim()
        }
        return data
      },
    ],
  },
} 