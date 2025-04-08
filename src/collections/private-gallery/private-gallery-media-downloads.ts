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
  fields: [
    {
      name: 'mediaId',
      type: 'text',
      required: true,
      label: 'Media ID',
      admin: {
        description: 'ID or filename of the downloaded media',
      },
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: PRIVATE_GALLERIES_SLUG,
      required: true,
      hasMany: false,
      label: 'Private Gallery',
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
      label: 'Auth Token',
      admin: {
        description: 'The token used for this download',
      },
    },
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
      label: 'Download Date',
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
  ]
}; 