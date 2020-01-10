import { connection } from "../db";
import { VideoListItem } from "../../../api/video";

export const getList = (): Promise<VideoListItem[]> =>
    new Promise((resolve, reject) => {
        connection.query(`SELECT v.videourl FROM video v`, (_err, videos, _fields) => {
            const videoListItems = videos.map((b: any) => ({
                videoUrl: b.videourl
            }));

            resolve(videoListItems);
        });
    });
