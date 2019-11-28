import * as React from "react";
import galleryPhoto from "../images/gallery_foto.png";
import linkPhoto from "../images/link_foto.png";
import { Link } from "react-router-dom";
import { strings } from "../resources";
import * as getPrivateGalleryUrl from "../../../api/get-private-gallery-url";

const getContent = (
    isLoading?: boolean,
    result?: getPrivateGalleryUrl.PrivateGalleryUrlCheckResult
): { title?: string; description?: string; blog?: string } => {
    if (isLoading === undefined || result === undefined)
        return {
            title: strings.privateGallery.title,
            description: strings.privateGallery.description
        };

    if (result.gallery === undefined)
        return {
            title: strings.privateGallery.notExists.title,
            description: strings.privateGallery.notExists.description
        };

    if (result.gallery.state === getPrivateGalleryUrl.PrivateGalleryState.Available)
        return {
            title: strings.privateGallery.available.title
                .replace(":bride", result.gallery.bride)
                .replace(":groom", result.gallery.groom),
            description: strings.privateGallery.available.description
        };

    if (result.gallery.state === getPrivateGalleryUrl.PrivateGalleryState.TurnedOff)
        return {
            title: strings.privateGallery.turnedOff.title
                .replace(":bride", result.gallery.bride)
                .replace(":groom", result.gallery.groom),
            description: strings.privateGallery.turnedOff.description
        };

    if (result.gallery.state === getPrivateGalleryUrl.PrivateGalleryState.NotReady)
        return {
            title: strings.privateGallery.notReady.title
                .replace(":bride", result.gallery.bride)
                .replace(":groom", result.gallery.groom),
            description: strings.privateGallery.notReady.description
        };

    throw new Error("Not handled content!");
};

type PrivateGalleryProps = {};
type PrivateGalleryState = {
    password: string;
    isLoading?: boolean;
    result?: getPrivateGalleryUrl.PrivateGalleryUrlCheckResult;
};

export class PrivateGallery extends React.Component<PrivateGalleryProps, PrivateGalleryState> {
    state = {
        password: "",
        result: undefined,
        isLoading: undefined
    } as PrivateGalleryState;

    onPasswordChange(password: string) {
        this.setState({ password });
    }

    getPrivateGalleryUrl() {
        if (this.state.password) {
            this.setState({ isLoading: true });
            getPrivateGalleryUrl.getGalleryUrl(this.state.password).then(result => {
                this.setState({ result, isLoading: false });
            });
        }
    }

    render() {
        const content = getContent(this.state.isLoading, this.state.result);
        return (
            <div className="contact_form">
                <section>
                    <article>
                        <h1>{content.title}</h1>
                        <h2>{content.description}</h2>

                        <div>
                            {/* {$info} */}
                            <input
                                type="password"
                                name="password"
                                placeholder={strings.privateGallery.password}
                                onChange={e => this.onPasswordChange(e.target.value)}
                                value={this.state.password}
                                required
                            ></input>
                            <div>
                                <a onClick={e => this.getPrivateGalleryUrl()} className="button">
                                    {strings.privateGallery.enter}
                                </a>
                            </div>
                        </div>
                    </article>

                    <hgroup>
                        <img src={galleryPhoto} alt="" />
                    </hgroup>
                </section>
            </div>
        );
    }
}
