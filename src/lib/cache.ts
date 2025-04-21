import { revalidateTag } from 'next/cache'

export const revalidatePhotos = () => {
    revalidateTag('photos')
    revalidateTag('photos-page')
    revalidateTag('featured-photos')
}

export const revalidateOpinions = () => {
    revalidateTag('opinions')
}

export const revalidateVideos = () => {
    revalidateTag('featured-videos')
    revalidateTag('videos')
}

export const revalidateInstagram = () => {
    revalidateTag('instagram-posts')
}