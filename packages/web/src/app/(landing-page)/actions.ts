'use server'

import { getPayload } from 'payload'
import { OPINIONS_SLUG, PHOTOS_SLUG } from '../../collections/collectionSlugs'
import payloadConfig from '~/payload.config'
import { type OpinionMedia } from '~/payload-types'

export type Opinion = {
  id: number;
  title: string;
  author: string;
  content: string;
  rating: number;
  source: "google" | "facebook" | "pm";
  date: string;
  media?: {
    id: number;
    url: string;
    alt: string;
  };
}

export async function getOpinions(): Promise<Opinion[]> {
  try {
    const payload = await getPayload({
      config: payloadConfig,
    })

    const response = await payload.find({
      collection: OPINIONS_SLUG,
      where: {
        isPublished: {
          equals: true,
        },
      },
      sort: '-date', // Sort by date descending (newest first)
      limit: 10, // Limit to 10 opinions
      depth: 1, // Populate the media relationship
    })

    return response.docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      author: doc.author,
      content: doc.content,
      rating: doc.rating,
      source: doc.source,
      date: new Date(doc.date as string).toLocaleDateString(),
      media: doc.media ? {
        id: (doc.media as OpinionMedia).id,
        url: (doc.media as OpinionMedia).url!,
        alt: (doc.media as OpinionMedia).alt,
      } : undefined,
    }))
  } catch (error) {
    console.error('Error fetching opinions:', error)
    return [] // Return empty array in case of error
  }
}

// Re-export the Instagram types from the shared utility for backward compatibility
export { type InstagramPost } from '~/lib/instagram'

export type Photo = {
  id: number;
  url: string;
  alt: string;
  order: number;
  width: number;
  height: number;
}

export async function getFeaturedPhotos(limit = 24): Promise<Photo[]> {
  try {
    const payload = await getPayload({
      config: payloadConfig,
    })

    const response = await payload.find({
      collection: PHOTOS_SLUG,
      limit,
      sort: 'order', // Sort by order field (ascending by default)
      depth: 0, // No need for relationships
    })

    return response.docs.map(doc => ({
      id: doc.id,
      url: doc.url ?? '',
      alt: doc.alt ?? 'Wedding photo',
      order: doc.order ?? 0,
      width: doc.width ?? 800,
      height: doc.height ?? 600,
    }))
  } catch (error) {
    console.error('Error fetching featured photos:', error)
    return getMockPhotos() // Return mock photos in case of error
  }
}

export type Video = {
  id: string | number;
  title: string;
  descshort?: string;
  alias: string;
  videoUrl: string;
  order: number;
}

export async function getFeaturedVideos(limit = 3): Promise<Video[]> {
  try {
    const payload = await getPayload({
      config: payloadConfig,
    })

    const response = await payload.find({
      collection: 'videos',
      limit,
      sort: 'order', // Sort by order field (ascending by default)
      depth: 0, // No need for relationships
    })

    return response.docs.map(doc => ({
      id: doc.id,
      title: doc.title ?? '',
      descshort: doc.descshort,
      alias: doc.alias ?? '',
      videoUrl: doc.videoUrl ?? '',
      order: doc.order ?? 0,
    }))
  } catch (error) {
    console.error('Error fetching featured videos:', error)
    return getMockVideos() // Return mock videos in case of error
  }
}

function getMockVideos(): Video[] {
  return [
    {
      id: '1',
      title: 'Magiczny ślub Anny i Tomasza w górach',
      descshort: 'Piękna ceremonia w otoczeniu natury w Beskidach',
      alias: 'magiczny-slub-anny-tomasza',
      videoUrl: 'https://www.youtube.com/embed/jD1n6uP12YM',
      order: 1,
    },
    {
      id: '2',
      title: 'Eleganckie wesele Karoliny i Michała',
      descshort: 'Wytworna uroczystość w zabytkowym pałacu',
      alias: 'eleganckie-wesele-karolina-michal',
      videoUrl: 'https://www.youtube.com/embed/jQpxJ162FLI',
      order: 2,
    },
    {
      id: '3',
      title: 'Romantyczna ceremonia Patrycji i Kamila',
      descshort: 'Wzruszające śluby i klimatyczne wesele',
      alias: 'romantyczna-ceremonia-patrycja-kamil',
      videoUrl: 'https://www.youtube.com/embed/EI6n6YKcUmU',
      order: 3,
    }
  ];
}

function getMockPhotos(): Photo[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    url: `https://source.unsplash.com/random/800x600?wedding,${i + 1}`,
    alt: `Wedding photo sample ${i + 1}`,
    order: i + 1,
    width: 800,
    height: 600,
  }));
} 