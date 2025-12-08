'use server'

import { revalidateTag } from 'next/cache'

export const revalidatePhotos = async () => {
    revalidateTag('photos', 'max');
    revalidateTag('photos-page', 'max');
    revalidateTag('featured-photos', 'max');
}

export const revalidateOpinions = async () => {
    revalidateTag('opinions', 'max')
}

export const revalidateVideos = async () => {
    revalidateTag('featured-videos', 'max')
    revalidateTag('videos', 'max')
}

export const revalidateInstagram = async () => {
    revalidateTag('instagram-posts', 'max')
}