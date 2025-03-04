'use server'

import { getPayload } from 'payload'
import { OPINIONS_SLUG } from '../../collections/collectionSlugs'
import payloadConfig from '~/payload.config'

export type Opinion = {
  id: number;
  author: string;
  content: string;
  rating: number;
  source: "google" | "facebook";
  date: string;
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
    })

    return response.docs.map(doc => ({
      id: doc.id,
      author: doc.author,
      content: doc.content,
      rating: doc.rating,
      source: doc.source,
      date: new Date(doc.date as string).toLocaleDateString(),
    }))
  } catch (error) {
    console.error('Error fetching opinions:', error)
    return [] // Return empty array in case of error
  }
} 