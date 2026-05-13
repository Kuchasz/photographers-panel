'use server'

import { revalidateTag } from 'next/cache'

const expireImmediately = { expire: 0 } as const

export const revalidatePhotos = async () => {
    revalidateTag('photos', expireImmediately)
    revalidateTag('photos-page', expireImmediately)
    revalidateTag('featured-photos', expireImmediately)
}

export const revalidateOpinions = async () => {
    revalidateTag('opinions', expireImmediately)
}

export const revalidateVideos = async () => {
    revalidateTag('featured-videos', expireImmediately)
    revalidateTag('videos', expireImmediately)
}

export const revalidateInstagram = async () => {
    revalidateTag('instagram-posts', expireImmediately)
}
