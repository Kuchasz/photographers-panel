'use server'

// Instagram types and functions moved from the landing page actions 
// to be reusable across the application

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

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
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

    const response = await fetch(`${apiUrl}?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${limit}&access_token=${INSTAGRAM_ACCESS_TOKEN}`);

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
    },
    {
      id: '5',
      permalink: 'https://www.instagram.com/p/sample5/',
      media_url: 'https://source.unsplash.com/random/600x600?wedding,5',
      media_type: 'IMAGE',
      caption: 'Piękne zdjęcie ślubne #ślub #wesele'
    },
    {
      id: '6',
      permalink: 'https://www.instagram.com/p/sample6/',
      media_url: 'https://source.unsplash.com/random/600x600?wedding,6',
      media_type: 'IMAGE',
      caption: 'Piękne zdjęcie ślubne #ślub #wesele'
    }
  ];
} 