'use server';

import { getPayload } from 'payload';
import payloadConfig from '~/payload.config';
import {
  PRIVATE_GALLERY_MEDIA_SLUG,
  PRIVATE_GALLERY_AUTH_TOKENS_SLUG
} from '~/collections/collectionSlugs';
import { headers } from 'next/headers';
import { type PrivateGallery } from '~/payload-types';

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

  // Fetch media from the private gallery collection
  const { docs: photos } = await payload.find({
    collection: PRIVATE_GALLERY_MEDIA_SLUG,
    limit: 1000,
    ...query,
  });

  return photos.map(photo => {
    const defaultUrl = photo.url ?? '';

    return {
      id: String(photo.id),
      alt: photo.filename ?? '',
      url: defaultUrl,
      width: photo.width ?? 0,
      height: photo.height ?? 0,
      sizes: {
        thumbnail: {
          url: photo.sizes?.thumbnail?.url ?? defaultUrl,
          width: photo.sizes?.thumbnail?.width ?? 400,
          height: photo.sizes?.thumbnail?.height ?? 300,
        },
        big: {
          url: photo.sizes?.big?.url ?? defaultUrl,
          width: photo.sizes?.big?.width ?? 768,
          height: photo.sizes?.big?.height ?? 1024,
        },
      }
    };
  });
}