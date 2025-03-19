import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_MEDIA_SLUG, PRIVATE_GALLERY_VISITS_SLUG } from '../collectionSlugs'
import { authenticatedOrPublished } from '~/access/authenticatedOrPublished'

export const PrivateGallery: CollectionConfig = {
  slug: PRIVATE_GALLERIES_SLUG,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'notes', 'date', 'state'],
    group: 'Galeria prywatna',
  },
  labels: {
    singular: {
      en: 'Private Gallery',
      pl: 'Galeria prywatna',
    },
    plural: {
      en: 'Private Galleries',
      pl: 'Galerie prywatne',
    },
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'statistics',
      type: 'ui',
      label: 'Statistics',
      admin: {
        components: {
          Field: '@/components/private-gallery-visits',
        },
      },
    },
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
          label: 'Robocza',
          value: 'draft',
        },
        {
          label: 'Opublikowana',
          value: 'published',
        },
        {
          label: 'Archiwalna',
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
      name: 'galleryMedia',
      type: 'upload',
      label: 'Gallery Media',
      relationTo: PRIVATE_GALLERY_MEDIA_SLUG,
      hasMany: true,
    },
    {
      name: 'galleryVisits',
      type: 'relationship',
      label: 'Gallery Visits',
      relationTo: PRIVATE_GALLERY_VISITS_SLUG,
      hasMany: true,
      admin: {
        description: 'Related visits to this gallery',
        readOnly: true,
      },
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