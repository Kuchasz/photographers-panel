// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { en } from '@payloadcms/translations/languages/en'
import { pl } from '@payloadcms/translations/languages/pl'
import { OfferMedia } from './collections/offers/offer-media'
import { Photo } from './collections/photos/photo'
import { PrivateGallery } from './collections/private-gallery/private-gallery'
import { SiteEvent } from './collections/site/site-event'
import { SiteVisit } from './collections/site/site-visit'
import { Opinion } from './collections/site/opinion'
import { Users } from './collections/users'
import { Video } from './collections/videos/video'
import { defaultLexical } from './fields/defaultLexical'
import { PrivateGalleryMedia } from './collections/private-gallery/private-gallery-media'
import { PrivateGalleryVisits } from './collections/private-gallery/private-gallery-visits'
import { PrivateGalleryAuthTokens } from './collections/private-gallery/private-gallery-auth-tokens'
import { Offer } from './globals/offer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users, 
    PrivateGallery, 
    PrivateGalleryMedia, 
    PrivateGalleryVisits, 
    PrivateGalleryAuthTokens,
    Video, 
    SiteEvent, 
    SiteVisit, 
    OfferMedia, 
    Opinion, 
    Photo
  ],
  globals: [
    Offer
  ],
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, pl },
  },
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
