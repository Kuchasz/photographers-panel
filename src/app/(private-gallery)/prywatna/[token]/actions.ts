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
import { NextResponse } from 'next/server';

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

/**
 * Server action to proxy photo downloads with CORS support.
 * @param imageDownloadUrl - The direct URL to the image to download
 * @param token - The gallery access token
 * @returns {Promise<Response>} - The proxied image response with CORS headers
 */
export async function downloadPhotoWithCors(imageDownloadUrl: string, token: string): Promise<Response> {
  // Get gallery from token, even if expired
  const payload = await getPayload({ config: payloadConfig });
  const authTokens = await payload.find({
    collection: PRIVATE_GALLERY_AUTH_TOKENS_SLUG,
    where: { token: { equals: token } },
  });
  const authToken = authTokens.docs[0];
  if (!authToken) {
    return new NextResponse('Invalid token', { status: 403 });
  }
  const gallery = authToken.gallery as PrivateGallery;
  if (!gallery || !gallery.directPath) {
    return new NextResponse('Gallery not found', { status: 404 });
  }
  // Verify imageDownloadUrl starts with gallery.directPath
  if (!imageDownloadUrl.startsWith(gallery.directPath)) {
    return new NextResponse('Image URL not allowed', { status: 403 });
  }
  // Proxy the image download
  try {
    const imageRes = await fetch(imageDownloadUrl);
    if (!imageRes.ok) {
      return new NextResponse('Failed to fetch image', { status: 502 });
    }
    // Create a new response with CORS headers
    const headers = new Headers(imageRes.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return new NextResponse(imageRes.body, {
      status: imageRes.status,
      headers,
    });
  } catch (err) {
    return new NextResponse('Error downloading image', { status: 500 });
  }
}