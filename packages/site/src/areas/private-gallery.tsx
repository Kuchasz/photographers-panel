import * as commonPrivateGallery from "@pp/api/dist/private-gallery";
import * as privateGallery from "@pp/api/dist/site/private-gallery";
import * as React from "react";
import galleryPhoto from "../images/page_private_photo.png";
import { Link } from "react-router";
import { ResultType } from "@pp/api/dist/common";
import { strings } from "../resources";

const getContent = (
    isLoading?: boolean,
    result?: privateGallery.PrivateGalleryUrlCheckResult
): { title?: string; description?: string; blog?: string } => {
    if (isLoading === undefined || result === undefined)
        return {
            title: strings.privateGallery.title,
            description: strings.privateGallery.description,
        };

    if (result.gallery === undefined)
        return {
            title: strings.privateGallery.notExists.title,
            description: strings.privateGallery.notExists.description,
        };

    if (result.gallery.state === commonPrivateGallery.PrivateGalleryState.Available)
        return {
            title: strings.privateGallery.available.title.replace(':title', result.gallery.title),
            description: strings.privateGallery.available.description,
        };

    if (result.gallery.state === commonPrivateGallery.PrivateGalleryState.TurnedOff)
        return {
            title: strings.privateGallery.turnedOff.title.replace(':title', result.gallery.title),
            description: strings.privateGallery.turnedOff.description,
        };

    if (result.gallery.state === commonPrivateGallery.PrivateGalleryState.NotReady)
        return {
            title: strings.privateGallery.notReady.title.replace(':title', result.gallery.title),
            description: strings.privateGallery.notReady.description,
        };

    throw new Error('Not handled content!');
};

export const PrivateGallery = () => {
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [isLoading, setIsLoading] = React.useState<boolean | undefined>(undefined);
    const [isLoadingNotification, setIsLoadingNotification] = React.useState<boolean | undefined>(undefined);
    const [result, setResult] = React.useState<privateGallery.PrivateGalleryUrlCheckResult | undefined>(undefined);
    const [notificationResult, setNotificationResult] = React.useState<privateGallery.SubscribtionResult | undefined>(undefined);
    
    const viewGalleryRef = React.useRef<HTMLFormElement>(null);

    const getPrivateGalleryUrl = () => {
        if (password) {
            setIsLoading(true);
            privateGallery.getGalleryUrl(password).then((galleryResult) => {
                const passwordReset = galleryResult.gallery === undefined;
                setResult(galleryResult);
                setIsLoading(false);
                if (passwordReset) {
                    setPassword('');
                }
            });
        }
    };

    const subscribeForNotification = async () => {
        if (result?.gallery !== undefined) {
            setIsLoadingNotification(true);
            const subscribeResult = await privateGallery.subscribeForNotification({
                privateGalleryId: result.gallery.id,
                email: email,
            });
            setNotificationResult(subscribeResult);
            setIsLoadingNotification(false);
        }
    };

    const content = getContent(isLoading, result);

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
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required></input>
                            <div>
                                <a onClick={getPrivateGalleryUrl} className="button">
                                    {strings.privateGallery.check}
                                </a>
                            </div>
                        </div>
                    ) : null}
                    {result?.gallery?.state === commonPrivateGallery.PrivateGalleryState.NotReady ? (
                        <div className="form">
                            {isLoadingNotification ? (
                                <div className="cover">{strings.privateGallery.notification.subscribing}</div>
                            ) : null}
                            {notificationResult?.type === ResultType.Success ? (
                                <div className="cover">
                                    {strings.privateGallery.notification.subscribedSuccessfully}
                                </div>
                            ) : null}
                            {notificationResult?.type === ResultType.Error ? (
                                <div>
                                    {
                                        strings.privateGallery.notification.errors[
                                            notificationResult.error
                                        ]
                                    }
                                </div>
                            ) : null}
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                name="email"
                                placeholder={strings.privateGallery.notification.email}
                                required
                            />
                            <a className="button" onClick={subscribeForNotification}>
                                {strings.privateGallery.notification.subscribe}
                            </a>
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                    ) : null}
                    {result?.gallery ? (
                        <div>
                            {result.gallery.state === commonPrivateGallery.PrivateGalleryState.Available ? (
                                <>
                                    <form
                                        ref={viewGalleryRef}
                                        method="POST"
                                        action={privateGallery.viewGallery.route}>
                                        <input name="galleryId" value={result.gallery.id} type="hidden"></input>
                                        <input name="galleryUrl" value={result.gallery.url} type="hidden"></input>
                                    </form>
                                    <a onClick={() => viewGalleryRef.current?.submit()} className="button">
                                        {strings.privateGallery.enterGallery}
                                    </a>
                                </>
                            ) : result.blog ? (
                                <div>
                                    <span>
                                        {strings.privateGallery.blogAvailable.replace(':title', result.blog.title)}
                                    </span>
                                    <br />
                                    <br />
                                    <Link
                                        className="button"
                                        key={result.blog.alias}
                                        to={'/blog/' + result.blog.alias}>
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
};
