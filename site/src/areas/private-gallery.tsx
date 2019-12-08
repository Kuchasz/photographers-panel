import * as React from "react";
import galleryPhoto from "../images/gallery_foto.png";
import linkPhoto from "../images/link_foto.png";
import { Link } from "react-router-dom";
import { strings } from "../resources";
import * as getPrivateGalleryUrl from "../../../api/private-gallery";
import * as notification from "../../../api/notification";

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
    email: string;
    isLoading?: boolean;
    result?: getPrivateGalleryUrl.PrivateGalleryUrlCheckResult;
    notificationResult?: notification.SubscribtionResult;
};

export class PrivateGallery extends React.Component<PrivateGalleryProps, PrivateGalleryState> {
    state = {
        password: "",
        email: "",
        result: undefined,
        isLoading: undefined
    } as PrivateGalleryState;

    onPasswordChange(password: string) {
        this.setState({ password });
    }

    onEmailChange(email: string) {
        this.setState({ email });
    }

    getPrivateGalleryUrl() {
        if (this.state.password) {
            this.setState({ isLoading: true });
            getPrivateGalleryUrl.getGalleryUrl(this.state.password).then(result => {
                const passwordReset = result.gallery === undefined;
                this.setState(state => ({ result, isLoading: false, password: passwordReset ? "" : state.password }));
            });
        }
    }

    async subscribeForNotification() {
        if(this.state.result !== undefined && this.state.result.gallery !== undefined){
            const result = await notification.subscribeForNotification({ privateGalleryId: this.state.result.gallery.id, email: this.state.email });
            this.setState({notificationResult: result});
        }
    }

    render() {
        const content = getContent(this.state.isLoading, this.state.result);
        const result = this.state.result;
        return (
            <div className="contact_form">
                <section>
                    <article>
                        <h1>{content.title}</h1>
                        <h2>{content.description}</h2>

                        {!result || !result.gallery ? (
                            <div>
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
                                        {strings.privateGallery.check}
                                    </a>
                                </div>
                            </div>
                        ) : null}
                        {result &&
                        result.gallery &&
                        result.gallery.state === getPrivateGalleryUrl.PrivateGalleryState.NotReady ? (
                            <div>
                                <input
                                    onChange={e => this.onEmailChange(e.target.value)}
                                    value={this.state.email}
                                    type="email"
                                    name="email"
                                    placeholder={strings.privateGallery.email}
                                    required
                                />
                                <input
                                    onClick={e => this.subscribeForNotification()}
                                    type="submit"
                                    name="submit"
                                    value={strings.privateGallery.subscribe}
                                />
                            </div>
                        ) : null}
                        {result && result.gallery ? (
                            <div>
                                {result.gallery.state === getPrivateGalleryUrl.PrivateGalleryState.Available ? (
                                    <Link to={result.gallery.url} className="button">
                                        {strings.privateGallery.enterGallery}
                                    </Link>
                                ) : result.blog ? (
                                    <div>
                                        <span>
                                            {strings.privateGallery.blogAvailable.replace(":title", result.blog.title)}
                                        </span>
                                        <br />
                                        <br />
                                        <Link
                                            className="button"
                                            key={result.blog.alias}
                                            to={"/blog/" + result.blog.alias}
                                        >
                                            {strings.privateGallery.enterBlog}
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </article>

                    <hgroup>
                        <img src={galleryPhoto} alt="" />
                    </hgroup>
                </section>
            </div>
        );
    }
}
