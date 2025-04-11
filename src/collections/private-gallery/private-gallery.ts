import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_VISITS_SLUG, PRIVATE_GALLERY_PHOTO_SLUG } from '../collectionSlugs'
import { authenticatedOrPublished } from '~/access/authenticatedOrPublished'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const PrivateGallery: CollectionConfig = {
  slug: PRIVATE_GALLERIES_SLUG,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'notes', 'date', 'state'],
    group: 'Galeria prywatna'
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
      label: {
        en: 'Statistics',
        pl: 'Statystyki',
      },
      admin: {
        components: {
          Field: '~/components/private-gallery-visits',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: {
        en: 'Title',
        pl: 'Tytuł',
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
      label: {
        en: 'State',
        pl: 'Stan',
      },
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
      label: {
        en: 'Password',
        pl: 'Hasło',
      },
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'directPath',
      type: 'text',
      required: true,
      label: {
        en: 'Direct Path',
        pl: 'Ścieżka bezpośrednia',
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        en: 'Notes',
        pl: 'Notatki',
      },
    },
    {
      name: 'galleryVisits',
      type: 'join',
      label: {
        en: 'Gallery Visits',
        pl: 'Odwiedziny galerii',
      },
      collection: PRIVATE_GALLERY_VISITS_SLUG,
      on: 'gallery',
      admin: {
        description: 'Related visits to this gallery',
      },
    },
    {
      name: 'photo',
      type: 'relationship',
      label: {
        en: 'Photo',
        pl: 'Zdjęcie główne',
      },
      relationTo: PRIVATE_GALLERY_PHOTO_SLUG,
      hasMany: false,
      admin: {
        description: 'Main photo displayed at the top of the gallery',
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