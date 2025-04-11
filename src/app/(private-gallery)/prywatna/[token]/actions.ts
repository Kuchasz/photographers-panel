'use server';

import { headers } from 'next/headers';
import { getPayload } from 'payload';
import {
  PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
  PRIVATE_GALLERY_MEDIA_DOWNLOADS_SLUG
} from '~/collections/collectionSlugs';
import { fetchJAlbumPhotos } from '~/lib/jalbum';
import { PrivateGalleryPhoto, type PrivateGallery } from '~/payload-types';
import payloadConfig from '~/payload.config';

async function validateGalleryToken(token: string) {
  const payload = await getPayload({
    config: payloadConfig,
  });

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const userAgent = headersList.get('user-agent') ?? 'unknown';

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
    userAgent,
    galleryId: (authToken.gallery as PrivateGallery).id,
    payload,
    photo: (authToken.gallery as PrivateGallery).photo! as PrivateGalleryPhoto,
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
    return null;
  }

  const galleryData = tokenData.authToken.gallery as PrivateGallery;

  const jalbumPhotos = await fetchJAlbumPhotos(galleryData.directPath)!;

  return ({
    photo: {
      id: String(tokenData.photo.id),
      alt: tokenData.photo.alt,
      url: tokenData.photo.url!,
      width: tokenData.photo.width!,
      height: tokenData.photo.height!,
      sizes: {
        thumbnail: {
          url: tokenData.photo.thumbnailURL!,
          width: tokenData.photo.width!,
          height: tokenData.photo.height!,
        },
        big: {
          url: tokenData.photo.url!,
          width: tokenData.photo.width!,
          height: tokenData.photo.height!,
        },
      }
    },
    photos: jalbumPhotos.map(photo => ({
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
    }))
  })
}

export async function registerPhotoDownload(token: string, photoId: string) {
  const tokenData = await validateGalleryToken(token);

  if (!tokenData) {
    return { success: false, error: 'Invalid or expired token' };
  }

  try {
    await tokenData.payload.create({
      collection: PRIVATE_GALLERY_MEDIA_DOWNLOADS_SLUG,
      data: {
        mediaId: photoId,
        gallery: tokenData.galleryId,
        token: tokenData.authToken.id,
        ip: tokenData.ip,
        date: new Date().toISOString(),
        userAgent: tokenData.userAgent,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error recording photo download:', error);
    return { success: false, error: 'Failed to record photo download' };
  }
}