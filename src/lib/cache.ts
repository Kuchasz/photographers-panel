'use server'

import { revalidateTag } from 'next/cache'

export const revalidatePhotos = async () => {
    revalidateTag('photos')
    revalidateTag('photos-page')
    revalidateTag('featured-photos')
}

export const revalidateOpinions = async () => {
    revalidateTag('opinions')
}

export const revalidateVideos = async () => {
    revalidateTag('featured-videos')
    revalidateTag('videos')
}

export const revalidateInstagram = async () => {
    revalidateTag('instagram-posts')
}