import type { CollectionConfig, TextFieldSingleValidation } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { VIDEOS_SLUG } from '../collectionSlugs'

export const Video: CollectionConfig = {
  slug: VIDEOS_SLUG,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'alias', 'updatedAt']
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'alias',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'desc',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'descshort',
      label: 'Short Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'videoUrl',
      label: 'Video URL',
      type: 'text',
      required: true,
      validate: ((value) => {
        if (!value) return 'Video URL is required'
        if (
          typeof value === 'string' &&
          !value.includes('youtube.com/embed/') &&
          !value.includes('vimeo.com')
        ) {
          return 'Video URL must be a valid YouTube or Vimeo embed URL'
        }
        return true
      }) as TextFieldSingleValidation,
    },
    {
      name: 'photo',
      label: 'Thumbnail Photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Tags (comma separated)',
    },
  ],
}
