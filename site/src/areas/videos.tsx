import * as React from "react";
import { VideoListItem, getVideosList } from "@pp/api/site/video";
import { Link } from "react-router-dom";

type BlogsProps = { initialState?: VideoListItem[] };
type BlogsState = { videos?: VideoListItem[] };

export class Videos extends React.Component<BlogsProps, BlogsState> {
    state = this.props.initialState !== undefined ? { videos: this.props.initialState } : { videos: undefined };

    componentDidMount() {
        if (this.state.videos === undefined) {
            getVideosList().then(videos => this.setState({ videos }));
        }
    }

    render() {
        return (
            <div className="videos">
                <section>
                    {this.state.videos?.map(v => (
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
                                allowFullScreen
                            ></iframe>
                        </div>
                    ))}
                </section>
            </div>
        );
    }
}

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
