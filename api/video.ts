export interface VideoListItem {
    videoUrl: string;        
}

const getVideosListRoute = "/api/videos-list";
export const getVideosList = () =>
    new Promise<VideoListItem[]>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getVideosListRoute)
            .then(result => result.json())
            .then(resolve);
    });
getVideosList.route = getVideosListRoute;
