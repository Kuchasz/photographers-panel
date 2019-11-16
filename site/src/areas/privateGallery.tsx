import * as React from "react";
import galleryPhoto from "../images/gallery_foto.png";
import linkPhoto from "../images/link_foto.png";
import { Link } from "react-router-dom";
import { strings } from "../resources";

type PrivateGalleryProps = {};
type PrivateGalleryState = {};

export class PrivateGallery extends React.Component<PrivateGalleryProps, PrivateGalleryState> {
    render() {
        return (
            <div className="contact_form">
                <section>
                    <article>
                        <h1>{strings.privateGallery.title}</h1>
                        <h2>{strings.privateGallery.description}</h2>

                        <form>
                            {/* {$info} */}
                            <input
                                type="password"
                                name="password"
                                placeholder={strings.privateGallery.password}
                                required
                            ></input>
                            <input type="submit" name="submit" value={strings.privateGallery.enter}></input>
                        </form>
                    </article>

                    <hgroup>
                        <img src={galleryPhoto} alt="" />
                    </hgroup>
                </section>
            </div>
        );
    }
}
