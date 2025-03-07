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

  return photos;
}

export async function getPhoto(id: string) {
  const payload = await getPayload({
    config: payloadConfig,
  });

  try {
    const photo = await payload.findByID({
      collection: 'photos',
      id,
    });
    
    return photo;
  } catch (error) {
    return null;
  }
} 