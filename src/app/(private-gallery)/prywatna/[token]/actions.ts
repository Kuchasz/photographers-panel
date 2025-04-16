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
import { getFilenameFromUrl } from '~/lib/file';

type TokenData = Awaited<ReturnType<typeof validateGalleryToken>>;

function convertPhoto(photo: number | PrivateGalleryPhoto | null | undefined) {

  if (!photo || typeof photo === 'number') {
    return null;
  }

  return {
    id: String(photo.id),
    alt: photo.alt,
    url: photo.url!,
    width: photo.width!,
    height: photo.height!,
    sizes: {
      thumbnail: {
        url: photo.thumbnailURL!,
        width: photo.width!,
        height: photo.height!,
      },
      big: {
        url: photo.url!,
        width: photo.width!,
        height: photo.height!,
      },
    }
  };
}

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

  if (!authToken) {
    return null;
  }

  return {
    expired: authToken.expiresAt < new Date().toISOString(),
    authToken,
    ip,
    userAgent,
    galleryId: (authToken.gallery as PrivateGallery).id,
    payload,
    photo: (authToken.gallery as PrivateGallery).photo,
    directPath: (authToken.gallery as PrivateGallery).directPath,
  };
}

export async function getGalleryTitle(token: string): Promise<string> {
  const tokenData = await validateGalleryToken(token);

  if (!tokenData || tokenData.expired) {
    return '';
  }

  const galleryData = tokenData.authToken.gallery as PrivateGallery;

  return galleryData?.title || '';
}

export async function getPhotos(token: string) {
  const tokenData = await validateGalleryToken(token);

  if (!tokenData || tokenData.expired) {
    return null;
  }

  const galleryData = tokenData.authToken.gallery as PrivateGallery;

  const jalbumPhotos = await fetchJAlbumPhotos(galleryData.directPath)!;

  return ({
    photo: convertPhoto(tokenData.photo),
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

/**
 * Server action to proxy photo downloads with CORS support.
 * @param imageDownloadUrl - The direct URL to the image to download
 * @param token - The gallery access token
 * @returns {Promise<{ blob?: Blob, filename?: string, error?: string }>} - The image blob and filename or error
 */
export async function downloadPhotoWithCors(imageDownloadUrl: string, token: string): Promise<{ blob?: Blob, filename?: string, error?: string }> {

  // Helper to register the download
  const registerDownload = async (photoId: string, tokenData: TokenData) => {
    const payload = await getPayload({ config: payloadConfig });
    await payload.create({
      collection: PRIVATE_GALLERY_MEDIA_DOWNLOADS_SLUG,
      data: {
        mediaId: photoId,
        gallery: tokenData!.galleryId,
        token: tokenData!.authToken.id,
        date: new Date().toISOString(),
        ip: tokenData!.ip,
        userAgent: tokenData!.userAgent
      },
    });
  };

  try {
    // Get gallery and verify URL
    const tokenData = await validateGalleryToken(token);
    if (!tokenData || tokenData.expired) {
      return { error: 'Gallery not found' };
    }
    if (!imageDownloadUrl.startsWith(tokenData.directPath)) {
      return { error: 'Image URL not allowed' };
    }

    // Proxy the image download
    const imageRes = await fetch(imageDownloadUrl);
    if (!imageRes.ok) {
      return { error: 'Failed to fetch image' };
    }

    // Register the download
    const urlObj = new URL(imageDownloadUrl);
    const photoId = urlObj.pathname.split('/').pop() || '';
    await registerDownload(photoId, tokenData);

    // Get the blob and filename
    const blob = await imageRes.blob();
    const filename = getFilenameFromUrl(imageDownloadUrl);

    return { blob, filename };
  } catch (err: any) {
    console.error('Error during photo download:', err);
    return { error: err.message || 'Error downloading image' };
  }
}