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

export type InstagramPost = {
  id: string;
  permalink: string;
  media_url: string;
  thumbnail_url?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption?: string;
}

// Instagram Graph API Configuration - Replace these with your actual values
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN ?? 'YOUR_INSTAGRAM_ACCESS_TOKEN';
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID ?? 'YOUR_INSTAGRAM_USER_ID';
const INSTAGRAM_API_VERSION = 'v22.0'; // Update this to the latest version when needed

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  try {
    // Check if we're using real credentials
    const usingMockData =
      INSTAGRAM_ACCESS_TOKEN === 'YOUR_INSTAGRAM_ACCESS_TOKEN' ||
      INSTAGRAM_USER_ID === 'YOUR_INSTAGRAM_USER_ID';

    if (usingMockData) {
      console.warn('Using mock Instagram data. Set up INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID env variables for real data.');
      return getMockInstagramPosts();
    }

    // Fetch real Instagram posts using the Graph API
    // Documentation: https://developers.facebook.com/docs/instagram-api/reference/ig-user/media
    const apiUrl = `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${INSTAGRAM_USER_ID}/media`;

    const response = await fetch(`${apiUrl}?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=6&access_token=${INSTAGRAM_ACCESS_TOKEN}`);

    if (!response.ok) {
      const error = await response.json();
      console.error('Instagram API Error:', error);
      throw new Error(`Instagram API error: ${error.message ?? 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid response format from Instagram API:', data);
      throw new Error('Invalid response format from Instagram API');
    }

    // Transform the API response to match our InstagramPost type
    const posts: InstagramPost[] = data.data.map((post: {
      id: string;
      permalink: string;
      media_url: string;
      thumbnail_url?: string;
      media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
      caption?: string;
    }) => ({
      id: post.id,
      permalink: post.permalink,
      media_url: post.media_url,
      thumbnail_url: post.thumbnail_url,
      media_type: post.media_type,
      caption: post.caption,
    }));

    return posts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    // Fallback to mock data if there's an error
    console.warn('Falling back to mock Instagram data due to error');
    return getMockInstagramPosts();
  }
}

// Function to provide mock data for development or fallback
function getMockInstagramPosts(): InstagramPost[] {
  return [
    {
      id: '1',
      permalink: 'https://www.instagram.com/p/sample1/',
      media_url: 'https://source.unsplash.com/random/600x600?wedding,1',
      media_type: 'IMAGE',
      caption: 'Piękny dzień z wspaniałą parą #fotografia #ślub'
    },
    {
      id: '2',
      permalink: 'https://www.instagram.com/p/sample2/',
      media_url: 'https://source.unsplash.com/random/600x600?wedding,2',
      media_type: 'CAROUSEL_ALBUM',
      caption: 'Urocza sesja plenerowa #sesja #fotografia'
    },
    {
      id: '3',
      permalink: 'https://www.instagram.com/p/sample3/',
      media_url: 'https://source.unsplash.com/random/600x600?wedding,3',
      thumbnail_url: 'https://source.unsplash.com/random/600x600?wedding,3',
      media_type: 'VIDEO',
      caption: 'Magiczne chwile #miłość #ślub'
    },
    {
      id: '4',
      permalink: 'https://www.instagram.com/p/sample4/',
      media_url: 'https://source.unsplash.com/random/600x600?wedding,4',
      media_type: 'IMAGE',
      caption: 'Detale weselne #ślub #wesele'
    }
  ];
}

// Add a constant for the photos slug
// export const PHOTOS_SLUG = 'photos';

export type Photo = {
  id: number;
  url: string;
  alt: string;
  order: number;
}

export async function getFeaturedPhotos(limit = 8): Promise<Photo[]> {
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
    }))
  } catch (error) {
    console.error('Error fetching photos:', error)
    return getMockPhotos()
  }
}

// Fallback mock photos if needed
function getMockPhotos(): Photo[] {
  return [
    {
      id: 1,
      url: 'https://source.unsplash.com/random/800x600?wedding,1',
      alt: 'Piękne zdjęcie ślubne 1',
      order: 1,
    },
    {
      id: 2,
      url: 'https://source.unsplash.com/random/800x600?wedding,2',
      alt: 'Piękne zdjęcie ślubne 2',
      order: 2,
    },
    {
      id: 3,
      url: 'https://source.unsplash.com/random/800x600?wedding,3',
      alt: 'Piękne zdjęcie ślubne 3',
      order: 3,
    },
    {
      id: 4,
      url: 'https://source.unsplash.com/random/800x600?wedding,4',
      alt: 'Piękne zdjęcie ślubne 4',
      order: 4,
    },
    {
      id: 5,
      url: 'https://source.unsplash.com/random/800x600?wedding,5',
      alt: 'Piękne zdjęcie ślubne 5',
      order: 5,
    },
    {
      id: 6,
      url: 'https://source.unsplash.com/random/800x600?wedding,6',
      alt: 'Piękne zdjęcie ślubne 6',
      order: 6,
    },
    {
      id: 7,
      url: 'https://source.unsplash.com/random/800x600?wedding,7',
      alt: 'Piękne zdjęcie ślubne 7',
      order: 7,
    },
    {
      id: 8,
      url: 'https://source.unsplash.com/random/800x600?wedding,8',
      alt: 'Piękne zdjęcie ślubne 8',
      order: 8,
    },
  ];
} 