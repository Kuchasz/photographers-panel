'use server';

import { getPayload } from 'payload';
import payloadConfig from '~/payload.config';
import {
  PRIVATE_GALLERY_MEDIA_SLUG,
  PRIVATE_GALLERY_AUTH_TOKENS_SLUG
} from '~/collections/collectionSlugs';
import { headers } from 'next/headers';
import { type PrivateGallery } from '~/payload-types';
import { fetchJAlbumPhotos } from '~/jalbum';

// Function to get gallery title from token
export async function getGalleryTitle(token: string): Promise<string> {
  const payload = await getPayload({
    config: payloadConfig,
  });

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  // Get the token
  const authTokens = await payload.find({
    collection: PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
    where: {
      token: {
        equals: token,
      },
      ipAddress: {
        equals: ip,
      },
    },
  });

  // If no valid token is found or token is expired, return default title
  const authToken = authTokens.docs[0];
  if (!authToken || authToken.expiresAt < new Date().toISOString()) {
    return '';
  }

  // Get the gallery from the token
  const galleryData = authToken.gallery as PrivateGallery;
  
  // Return the gallery title or empty string if not found
  return galleryData?.title || '';
}

export async function getPhotos(token: string) {
  const payload = await getPayload({
    config: payloadConfig,
  });

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  // First, validate the token and get the associated gallery
  const authTokens = await payload.find({
    collection: PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
    where: {
      token: {
        equals: token,
      },
      ipAddress: {
        equals: ip,
      },
    },
  });

  // If no valid token is found or token is expired, return empty array
  const authToken = authTokens.docs[0];
  if (!authToken || authToken.expiresAt < new Date().toISOString()) {
    return [];
  }

  // Get the gallery ID from the token
  const { id: galleryId } = authToken.gallery as PrivateGallery;

  // Query for media belonging to this gallery
  const query = {
    sort: ['order', 'createdAt'],
    where: {
      gallery: {
        equals: galleryId,
      },
    },
  };


  const jalbumPhotos = await fetchJAlbumPhotos('https://ps-wed.azurewebsites.net/2025_02_22_Bolecina');

  return jalbumPhotos.map(photo => ({
    id: String(photo.id),
    alt: photo.alt,
    url: photo.src,
    width: photo.width,
    height: photo.height,
    sizes: {
      thumbnail: {
        url: photo.thumbnail,
        width: photo.thumbw,
        height: photo.thumbh,
      },
      big: {
        url: photo.src,
        width: photo.width,
        height: photo.height,
      },
    }
  }));
}