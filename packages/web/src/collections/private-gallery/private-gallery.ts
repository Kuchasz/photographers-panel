import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { PRIVATE_GALLERIES_SLUG } from '../collectionSlugs'
import { authenticatedOrPublished } from '~/access/authenticatedOrPublished'

export const PrivateGallery: CollectionConfig = {
  slug: PRIVATE_GALLERIES_SLUG,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'state'],
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
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
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
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
      name: 'relatedBlog',
      type: 'group',
      label: 'Related Blog',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Blog Title',
        },
        {
          name: 'alias',
          type: 'text',
          label: 'Blog Alias',
        },
      ],
    },
    {
      name: 'subscribersNotified',
      type: 'checkbox',
      label: 'Subscribers Notified',
      defaultValue: false,
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
      name: 'emails',
      type: 'array',
      label: 'Email Subscribers',
      fields: [
        {
          name: 'address',
          type: 'email',
          required: true,
          label: 'Email Address',
        },
        {
          name: 'notified',
          type: 'checkbox',
          label: 'Notified',
          defaultValue: false,
        },
        {
          name: 'notifiedDate',
          type: 'date',
          label: 'Notified Date',
          admin: {
            condition: (data) => Boolean(data?.notified),
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'media',
      type: 'array',
      label: 'Gallery Media',
      fields: [
        {
          name: 'imageUrl',
          type: 'text',
          required: true,
          label: 'Media URL',
          admin: {
            description: 'URL to the media file',
          },
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
        },
      ],
    },
    {
      name: 'visits',
      type: 'array',
      label: 'Gallery Visits',
      admin: {
        description: 'Record of visits to this gallery',
      },
      fields: [
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
      ],
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
  // endpoints: [
  //   {
  //     path: '/record-visit',
  //     method: 'post',
  //     handler: async (req, res, { payload }) => {
  //       try {
  //         const body = req.body || {};
  //         const galleryId = body.galleryId;
  //         const ip = body.ip;
  //         const userAgent = body.userAgent ?? '';
  //         const referrer = body.referrer ?? '';

  //         if (!galleryId || !ip) {
  //           return res.status(400).json({ 
  //             message: 'Gallery ID and IP address are required' 
  //           });
  //         }

  //         // Find the gallery
  //         const gallery = await payload.findByID({
  //           collection: PRIVATE_GALLERIES_SLUG,
  //           id: galleryId,
  //         });

  //         if (!gallery) {
  //           return res.status(404).json({ 
  //             message: 'Gallery not found' 
  //           });
  //         }

  //         // Add the visit to the gallery's visits array
  //         const visits = gallery.visits ?? [];
  //         const updatedGallery = await payload.update({
  //           collection: PRIVATE_GALLERIES_SLUG,
  //           id: galleryId,
  //           data: {
  //             visits: [
  //               ...visits,
  //               {
  //                 ip,
  //                 date: new Date().toISOString(),
  //                 userAgent,
  //                 referrer,
  //               },
  //             ],
  //           },
  //         });

  //         return res.status(200).json({ 
  //           message: 'Visit recorded successfully',
  //           gallery: {
  //             id: updatedGallery.id,
  //             title: updatedGallery.title,
  //           },
  //         });
  //       } catch (error) {
  //         console.error('Error recording visit:', error);
  //         return res.status(500).json({ 
  //           message: 'Error recording visit' 
  //         });
  //       }
  //     },
  //   },
  // ],
}
