// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { en } from '@payloadcms/translations/languages/en'
import { pl } from '@payloadcms/translations/languages/pl'
import { Blog } from './collections/blog/Blog'
import { Media } from './collections/Media'
import { Offer } from './collections/offers/offer'
import { OfferMedia } from './collections/offers/offer-media'
import { PrivateGallery } from './collections/private-gallery/PrivateGallery'
import { Event } from './collections/site/Event'
import { SiteVisit } from './collections/site/SiteVisit'
import { Users } from './collections/Users'
import { Video } from './collections/videos/Video'
import { defaultLexical } from './fields/defaultLexical'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, PrivateGallery, Blog, Video, Event, SiteVisit, Offer, OfferMedia],
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
