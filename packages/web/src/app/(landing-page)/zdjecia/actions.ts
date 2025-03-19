'use server';

import { getPayload } from 'payload';
import payloadConfig from '~/payload.config';

export async function getPhotos() {
  const payload = await getPayload({
    config: payloadConfig,
  });

  const query = {
    sort: ['order'],
  };

  const { docs: photos } = await payload.find({
    collection: 'photos',
    limit: 1000,
    ...query,
  });


  return photos.map(photo => {
    const defaultUrl = photo.url ?? '';

    return {
      id: String(photo.id),
      alt: photo.alt ?? '',
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