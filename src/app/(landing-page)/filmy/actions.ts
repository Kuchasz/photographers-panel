'use server'

import { getPayload } from 'payload'
import payloadConfig from '~/payload.config'
import { unstable_cache } from 'next/cache'
import { convertToEmbedUrl } from '~/lib/youtube'

export type Video = {
  id: string | number
  title: string
  descshort?: string
  desc?: string
  alias: string
  videoUrl: string
  order: number
}

export const getVideos = unstable_cache(
  async () => {
    const payload = await getPayload({
      config: payloadConfig,
    })

    const { docs: videos } = await payload.find({
      collection: 'videos',
      sort: ['order'],
    })

    return videos.map(doc => ({
      id: doc.id,
      title: doc.title ?? '',
      descshort: doc.descshort,
      desc: doc.desc,
      alias: doc.alias ?? '',
      videoUrl: convertToEmbedUrl(doc.videoUrl ?? ''),
      order: doc.order ?? 0,
    }))
  },
  ['videos-page'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['videos']
  }
)

export const getVideoByAlias = unstable_cache(
  async (alias: string) => {
    const payload = await getPayload({
      config: payloadConfig,
    })

    const { docs: videos } = await payload.find({
      collection: 'videos',
      where: {
        alias: {
          equals: alias,
        },
      },
    })

    const video = videos[0]
    if (!video) return null

    return {
      id: video.id,
      title: video.title ?? '',
      descshort: video.descshort,
      desc: video.desc,
      alias: video.alias ?? '',
      videoUrl: convertToEmbedUrl(video.videoUrl ?? ''),
      order: video.order ?? 0,
    }
  },
  ['video-detail'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['videos']
  }
) 