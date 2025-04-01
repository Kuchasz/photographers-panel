'use server';

import { headers } from 'next/headers';
import { getPayload } from 'payload';
import {
  PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
  PRIVATE_GALLERY_MEDIA_SLUG
} from '~/collections/collectionSlugs';
import { fetchJAlbumPhotos } from '~/lib/jalbum';
import { type PrivateGallery } from '~/payload-types';
import payloadConfig from '~/payload.config';

async function validateGalleryToken(token: string) {
  const payload = await getPayload({
    config: payloadConfig,
  });

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

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

  const authToken = authTokens.docs[0];
  if (!authToken || authToken.expiresAt < new Date().toISOString()) {
    return null;
  }

  return {
    authToken,
    ip,
    galleryId: (authToken.gallery as PrivateGallery).id,
    payload
  };
}

export async function getGalleryTitle(token: string): Promise<string> {
  const tokenData = await validateGalleryToken(token);

  if (!tokenData) {
    return '';
  }

  const galleryData = tokenData.authToken.gallery as PrivateGallery;

  return galleryData?.title || '';
}

export async function getPhotos(token: string) {
  const tokenData = await validateGalleryToken(token);

  if (!tokenData) {
    return [];
  }

  const galleryData = tokenData.authToken.gallery as PrivateGallery;

  const jalbumPhotos = await fetchJAlbumPhotos(galleryData.directPath);

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

export async function registerPhotoDownload(token: string, photoId: string) {
  const tokenData = await validateGalleryToken(token);

  if (!tokenData) {
    return { success: false, error: 'Invalid or expired token' };
  }

  try {
    const media = await tokenData.payload.findByID({
      collection: PRIVATE_GALLERY_MEDIA_SLUG,
      id: photoId,
    });

    const downloads = media.downloads ?? [];

    await tokenData.payload.update({
      collection: PRIVATE_GALLERY_MEDIA_SLUG,
      id: photoId,
      data: {
        downloads: [
          ...downloads,
          {
            ip: tokenData.ip,
            date: new Date().toISOString(),
          },
        ],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error recording photo download:', error);
    return { success: false, error: 'Failed to record photo download' };
  }
}