import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import { PRIVATE_GALLERIES_SLUG, PRIVATE_GALLERY_MEDIA_SLUG } from '../collectionSlugs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const PrivateGalleryMedia: CollectionConfig = {
  slug: PRIVATE_GALLERY_MEDIA_SLUG,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Private Gallery',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/private-gallery'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        position: 'centre',
        fit: 'contain',
      },
      {
        name: 'big',
        width: 1920,
        height: 1920,
        position: 'centre',
        fit: 'inside'
      },
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  },
  fields: [
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: PRIVATE_GALLERIES_SLUG,
      required: true,
      label: 'Private Gallery',
      admin: {
        description: 'The gallery this media belongs to',
        position: 'sidebar'
      },
      defaultValue: ({ req }) => {
        // Extract gallery ID from referer URL if uploading from gallery edit page
        let referer: string | undefined;

        // console.log('req', req.url);

        // return 1;

        // Safely access the referer header regardless of the headers object structure
        if (req?.headers) {
          const headers = req.headers as unknown as { referer?: string; referrer?: string };
          referer = headers.referer ?? headers.referrer;
        }

        // console.log('referer', referer);
        // console.log('req', req.pathname);

        if (referer) {
          try {
            const refererUrl = new URL(referer);
            const pathParts = refererUrl.pathname.split('/');

            // Check if we're in the admin panel editing a private gallery
            // Path format: /admin/collections/private-galleries/{galleryId}
            const adminIndex = pathParts.indexOf('admin');
            const collectionsIndex = pathParts.indexOf('collections');

            if (adminIndex !== -1 && collectionsIndex !== -1 &&
              pathParts[collectionsIndex + 1] === PRIVATE_GALLERIES_SLUG &&
              pathParts[collectionsIndex + 2]) {

              // Extract the gallery ID from the URL
              return pathParts[collectionsIndex + 2];
            }
          } catch (error) {
            // If URL parsing fails, return undefined
            console.error('Error parsing referer URL:', error);
          }
        }

        return undefined;
      }
    },
    {
      name: 'downloads',
      type: 'array',
      label: 'Downloads',
      admin: {
        description: 'Record of downloads for this media',
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
          label: 'Download Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          defaultValue: () => new Date(),
        },
      ],
    },
  ],
} 