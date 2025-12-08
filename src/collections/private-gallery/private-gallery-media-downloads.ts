import { type CollectionConfig } from "payload";
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_AUTH_TOKENS_SLUG } from "../collectionSlugs";

export const PrivateGalleryMediaDownloads: CollectionConfig = {
  slug: 'private-gallery-media-downloads',
  admin: {
    group: 'Galeria prywatna',
  },
  labels: {
    singular: {
      en: 'Media Download',
      pl: 'Pobranie zdjęcia',
    },
    plural: {
      en: 'Media Downloads',
      pl: 'Pobrania zdjęć',
    },
  },
   versions: {
    drafts: false,
  },
  fields: [
    {
      name: 'mediaId',
      type: 'text',
      required: true,
      label: {
        en: 'Media URL',
        pl: 'URL zdjęcia',
      },
      admin: {
        description: 'Full URL of the downloaded media',
      },
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: PRIVATE_GALLERIES_SLUG,
      required: true,
      hasMany: false,
      label: {
        en: 'Private Gallery',
        pl: 'Galeria prywatna',
      },
      admin: {
        description: 'The gallery this download belongs to',
      },
    },
    {
      name: 'token',
      type: 'relationship',
      relationTo: PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
      required: true,
      hasMany: false,
      label: {
        en: 'Auth Token',
        pl: 'Token dostępu',
      },
      admin: {
        description: 'The token used for this download',
      },
    },
    {
      name: 'ip',
      type: 'text',
      required: true,
      label: {
        en: 'IP Address',
        pl: 'Adres IP',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: {
        en: 'Download Date',
        pl: 'Data pobrania',
      },
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
      label: {
        en: 'User Agent',
        pl: 'Agent użytkownika',
      },
    },
  ]
}; 