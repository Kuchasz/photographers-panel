export interface VideoListItem {
    videoUrl: string;
    title?: string;
}

export const getVideosListRoute = '/api/videos/get-all-videos';
export const getVideosList = (): VideoListItem[] => [];
getVideosList.route = getVideosListRoute;
