import { postgresAdapter } from '@payloadcms/db-postgres'
// import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
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
import { OpinionMedia } from './collections/site/opinion-media'
import { Video } from './collections/videos/video'
import { PrivateGalleryVisits } from './collections/private-gallery/private-gallery-visits'
import { PrivateGalleryAuthTokens } from './collections/private-gallery/private-gallery-auth-tokens'
import { PrivateGalleryMediaDownloads } from './collections/private-gallery/private-gallery-media-downloads'
import { InstagramTokens } from './collections/instagram/instagram-tokens'
import { Offer } from './globals/offer'
import { Users } from './collections/users'
import { defaultLexical } from './fields/defaultLexical'
import { migrations } from './migrations'
import { PrivateGalleryPhoto } from './collections/private-gallery/private-gallery-photo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
  },
  loggingLevels: {
    FileUploadError: 'debug',
    FileRetrievalError: 'debug',
    MissingFile: 'debug',
  },
  logger: {
    options: {
      level: 'debug'
    }
  },
  upload: {
    debug: true,
    useTempFiles: true,
    tempFileDir: '../temp',
  },
  collections: [
    Users,
    PrivateGallery,
    PrivateGalleryPhoto,
    PrivateGalleryVisits,
    PrivateGalleryAuthTokens,
    PrivateGalleryMediaDownloads,
    Video,
    SiteEvent,
    SiteVisit,
    OfferMedia,
    Opinion,
    OpinionMedia,
    Photo,
    InstagramTokens
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
    outputFile: 'payload-types.ts',
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
    prodMigrations: migrations
  }),
  sharp,
  plugins: [
    // payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
