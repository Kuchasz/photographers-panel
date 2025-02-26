import { VideoListItem } from "@pp/api/dist/site/video";
import * as React from "react";

type VideosProps = { initialState?: VideoListItem[] };

export const Videos = ({ initialState }: VideosProps) => {
    const [videos, setVideos] = React.useState<VideoListItem[] | undefined>(initialState);

    React.useEffect(() => {
        if (videos === undefined) {
            // getVideosList().then(setVideos);
        }
    }, []);

    return (
        <div className="videos">
            <section>
                {videos?.map((v) => (
                    <div key={v.videoUrl} className="video">
                        {/* <div className="ripple">
                            <div></div>
                            <div></div>
                        </div> */}
                        <iframe
                            key={v.videoUrl}
                            width="560"
                            height="315"
                            src={v.videoUrl}
                            frameBorder="0"
                            allow="autoplay; encrypted-media;"
                            allowFullScreen></iframe>
                    </div>
                ))}
            </section>
        </div>
    );
};

// <div class="gallery">
//     <section>
//         <ul>
//         {foreach $video as $vid}
//             <a href="{$smarty.server.REQUEST_URI}/{$vid->alias}">
//                 <li class="category">
//                     <img src="media/images/video/{$vid->photo}" alt="{$vid->title}" />
//                     <h1>{$vid->title}</h1>
//                     <h2>{$vid->descshort}</h2>
//                 </li>
//             </a>
//         {/foreach}
//         </ul>

//     </section>
// </div>
