'use server'

import { getPayload } from "payload";
import payloadConfig from "~/payload.config";
import { INSTAGRAM_TOKENS_SLUG } from '~/collections/collectionSlugs';

export type InstagramPost = {
  id: string;
  permalink: string;
  media_url: string;
  thumbnail_url?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption?: string;
  timestamp?: string;
  username?: string;
}

type InstagramMediaItem = {
  id: string;
}

// API response types
interface InstagramMediaResponse {
  data: {
    id: string;
    [key: string]: unknown;
  }[];
  paging?: {
    cursors: {
      before?: string;
      after?: string;
    };
    next?: string;
  };
  error?: {
    message: string;
    type: string;
    code: number;
    [key: string]: unknown;
  };
}

// Instagram token from database
export interface InstagramTokenDB {
  id: string;
  accessToken: string;
  expiresAt?: string;
  [key: string]: unknown;
}

// Instagram Graph API Configuration
// Store cached token to minimize database calls
let cachedToken: { value: string; expires?: Date } | null = null;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID ?? 'YOUR_INSTAGRAM_USER_ID';
const INSTAGRAM_API_VERSION = 'v22.0'; // Update this to the latest version when needed

/**
 * Fetches the Instagram token from the database using Payload API
 */
async function getInstagramToken(): Promise<string> {
  // Return cached token if it exists (simple caching to avoid frequent DB calls)
  if (cachedToken?.value) {
    return cachedToken.value;
  }
  
  // Initialize PayloadCMS client
  const payload = await getPayload({ config: payloadConfig });

  // Find the most recent token
  const tokens = await payload.find({
    collection: INSTAGRAM_TOKENS_SLUG,
    limit: 1,
    sort: '-createdAt', // Get the most recent token
  });

  if (!tokens.docs || tokens.docs.length === 0) {
    throw new Error('No Instagram token found in database');
  }
  
  // Get the most recent token
  const token = tokens.docs[0] as unknown as InstagramTokenDB;
  
  // Cache the token
  cachedToken = { 
    value: token.accessToken
  };
  
  return token.accessToken;
}

/**
 * Fetches Instagram posts using a two-step approach:
 * 1. Get media IDs from the user's feed
 * 2. Get detailed information for each media item
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  try {
    // Get token from database instead of env var
    let accessToken: string;
    
    try {
      accessToken = await getInstagramToken();
      console.log('accessToken', accessToken);
    } catch (error) {
      console.error('Error fetching Instagram token:', error);
      // Fallback to env var if database token isn't available
      accessToken = process.env.INSTAGRAM_ACCESS_TOKEN ?? 'YOUR_INSTAGRAM_ACCESS_TOKEN';
    }
    
    // Check if we're using real credentials
    const usingMockData =
      accessToken === 'YOUR_INSTAGRAM_ACCESS_TOKEN' ||
      INSTAGRAM_USER_ID === 'YOUR_INSTAGRAM_USER_ID';

    if (usingMockData) {
      console.warn('Using mock Instagram data. Set up valid Instagram credentials for real data.');
      return [];
    }

    // Step 1: Fetch media IDs
    const mediaItems = await fetchMediaList(limit, accessToken);
    
    if (!mediaItems.length) {
      console.warn('No Instagram media items found');
      return [];
    }
    
    // Step 2: Fetch detailed information for each media item
    const posts = await fetchMediaDetails(mediaItems, accessToken);
    return posts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    // Fallback to empty array if there's an error
    console.warn('Returning empty array due to error');
    return [];
  }
}

/**
 * Fetches a list of media IDs from the user's Instagram feed
 */
async function fetchMediaList(limit: number, accessToken: string): Promise<InstagramMediaItem[]> {
  try {
    const mediaUrl = `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${INSTAGRAM_USER_ID}/media?limit=${limit}&access_token=${accessToken}`;
    
    const response = await fetch(mediaUrl);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Instagram API Error when fetching media list:', error);
      throw new Error(`Instagram API error: ${error.message ?? 'Unknown error'}`);
    }
    
    const mediaData: InstagramMediaResponse = await response.json();
    
    // Check if there was an error in the response
    if (mediaData.error) {
      console.error("Error fetching media list:", mediaData.error.message);
      throw new Error(`Instagram API error: ${mediaData.error.message}`);
    }
    
    // Check if the response contains data
    if (!mediaData.data || !Array.isArray(mediaData.data)) {
      console.error('Invalid response format from Instagram API:', mediaData);
      throw new Error('Invalid response format from Instagram API');
    }
    
    // Explicitly convert to InstagramMediaItem[]
    const mediaItems: InstagramMediaItem[] = mediaData.data.map(item => ({
      id: item.id
    }));
    
    return mediaItems;
  } catch (error) {
    console.error('Error fetching Instagram media list:', error);
    throw error;
  }
}

/**
 * Fetches detailed information for each Instagram media item
 */
async function fetchMediaDetails(mediaItems: InstagramMediaItem[], accessToken: string): Promise<InstagramPost[]> {
  try {
    // Fields to fetch for each media item
    const mediaFields = [
      "caption",
      "id",
      "media_type",
      "media_url",
      "permalink",
      "thumbnail_url",
      "timestamp",
      "username"
    ].join(",");
    
    // Fetch details for each media item in parallel
    const postsPromises = mediaItems.map(async (item) => {
      try {
        const mediaDetailUrl = `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${item.id}?fields=${mediaFields}&access_token=${accessToken}`;
        const response = await fetch(mediaDetailUrl);
        
        if (!response.ok) {
          const error = await response.json();
          console.error(`Error fetching details for media ${item.id}:`, error);
          return null;
        }
        
        const mediaDetail = await response.json();
        
        // Create an InstagramPost object from the media details
        const post: InstagramPost = {
          id: mediaDetail.id,
          permalink: mediaDetail.permalink,
          media_url: mediaDetail.media_url,
          media_type: mediaDetail.media_type as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM',
          caption: mediaDetail.caption,
          timestamp: mediaDetail.timestamp,
          username: mediaDetail.username
        };
        
        // Only add thumbnail_url if it exists
        if (mediaDetail.thumbnail_url) {
          post.thumbnail_url = mediaDetail.thumbnail_url;
        }
        
        return post;
      } catch (error) {
        console.error(`Error fetching details for media ${item.id}:`, error);
        return null;
      }
    });
    
    // Wait for all requests to complete
    const postsResults = await Promise.all(postsPromises);
    
    // Filter out any null values (failed requests)
    const posts = postsResults.filter((post): post is InstagramPost => post !== null);
    
    return posts;
  } catch (error) {
    console.error('Error fetching Instagram media details:', error);
    throw error;
  }
} 