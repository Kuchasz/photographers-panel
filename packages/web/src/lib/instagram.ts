'use server'

// Types
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

// Instagram Graph API Configuration
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID ?? 'YOUR_INSTAGRAM_USER_ID';
const INSTAGRAM_API_VERSION = 'v22.0';

/**
 * Fetches a list of media IDs from the user's Instagram feed
 */
export async function fetchMediaList(limit: number, accessToken: string): Promise<InstagramMediaItem[]> {
  try {
    const mediaUrl = `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${INSTAGRAM_USER_ID}/media?limit=${limit}&access_token=${accessToken}`;

    const response = await fetch(mediaUrl);

    if (!response.ok) {
      const error = await response.json();
      console.error('Instagram API Error when fetching media list:', error);
      throw new Error(`Instagram API error: ${error.message ?? 'Unknown error'}`);
    }

    const mediaData: InstagramMediaResponse = await response.json();

    if (mediaData.error) {
      console.error("Error fetching media list:", mediaData.error.message);
      throw new Error(`Instagram API error: ${mediaData.error.message}`);
    }

    if (!mediaData.data || !Array.isArray(mediaData.data)) {
      console.error('Invalid response format from Instagram API:', mediaData);
      throw new Error('Invalid response format from Instagram API');
    }

    return mediaData.data.map(item => ({
      id: item.id
    }));
  } catch (error) {
    console.error('Error fetching Instagram media list:', error);
    throw error;
  }
}

/**
 * Fetches detailed information for each Instagram media item
 */
export async function fetchMediaDetails(mediaItems: InstagramMediaItem[], accessToken: string): Promise<InstagramPost[]> {
  try {
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

        const post: InstagramPost = {
          id: mediaDetail.id,
          permalink: mediaDetail.permalink,
          media_url: mediaDetail.media_url,
          media_type: mediaDetail.media_type as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM',
          caption: mediaDetail.caption,
          timestamp: mediaDetail.timestamp,
          username: mediaDetail.username
        };

        if (mediaDetail.thumbnail_url) {
          post.thumbnail_url = mediaDetail.thumbnail_url;
        }

        return post;
      } catch (error) {
        console.error(`Error fetching details for media ${item.id}:`, error);
        return null;
      }
    });

    const postsResults = await Promise.all(postsPromises);
    return postsResults.filter((post): post is InstagramPost => post !== null);
  } catch (error) {
    console.error('Error fetching Instagram media details:', error);
    throw error;
  }
} 