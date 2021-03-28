import React, { useEffect } from "react";
import { strings } from "../resources";
import { randomElement, first, nextElement, last } from "@pp/utils/array";
import { firstSegment } from "@pp/utils/url";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { routes } from "@pp/api/site/routes";
import { menuItems } from "../menu-items";
import { Headers } from "../components/headers";

const getHeaderBackgroundStyle = (photo: string) => {
    const url = require(`../images/top/${photo}`);
    return {
        backgroundImage: `url(${url})`
    };
};

const getSrc = (photo: string, ext: string) => require(`../images/top/${photo}${ext}`);

const selectedItem = (selectedPath: string, path: string) =>
    firstSegment(selectedPath) === path ? "current" : undefined;

export const Header = withRouter(props => {
    const [{ currentPhoto, prevPhoto }, setCurrentPhoto] = React.useState({
        prevPhoto: last(strings.main.topPhotos),
        currentPhoto: first(strings.main.topPhotos)
    });
    const [currentAdvantage, setCurrentAdvantage] = React.useState(strings.offer.slogan.advantages[0]);

    React.useEffect(() => {
        setTimeout(() => {
            const nextAdvantage = nextElement(strings.offer.slogan.advantages, currentAdvantage);
            setCurrentAdvantage(nextAdvantage);

            const nextPhoto = nextElement(strings.main.topPhotos, currentPhoto);
            setCurrentPhoto({ currentPhoto: nextPhoto, prevPhoto: currentPhoto });
        }, 5000);
    }, [currentAdvantage]);

    return (
        <>
            <Headers title={first(menuItems, mi => firstSegment(props.location.pathname) === mi.route).title}></Headers>
            <header id={first(menuItems, mi => firstSegment(props.location.pathname) === mi.route).fullPage ? "home" : "subpage"}>
                <div className="background">
                    <picture key={prevPhoto + "-p"}>
                        <source media="(min-width: 700px)" srcSet={getSrc(prevPhoto, ".jpg")}></source>
                        <source media="(max-width: 699px)" srcSet={getSrc(prevPhoto, "-600w.webp")}></source>
                        <img alt={prevPhoto.split("-").join(" ")} width="100%" height="100%" className="previous" src={getSrc(prevPhoto, ".jpg")}></img>
                    </picture>
                    <picture key={currentPhoto + "-c"}>
                        <source media="(min-width: 700px)" srcSet={getSrc(currentPhoto, ".jpg")}></source>
                        <source media="(max-width: 699px)" srcSet={getSrc(currentPhoto, "-600w.webp")}></source>
                        <img alt={currentPhoto.split("-").join(" ")} width="100%" height="100%" className="current" src={getSrc(currentPhoto, ".jpg")}></img>
                    </picture>
                </div>

                <span className="advantages">
                    {strings.offer.slogan.advantages.map(adv => (
                        <span key={adv} className={`advantage ${adv === currentAdvantage ? "current" : ""}`}>
                            {adv}
                        </span>
                    ))}
                </span>
                <div className="menu">
                    <nav>
                        <Link to={routes.home.route} id={selectedItem(props.location.pathname, routes.home.route)}>
                            {strings.menu.home}
                        </Link>
                        <Link
                            to={routes.pricing.route}
                            id={selectedItem(props.location.pathname, routes.pricing.route)}
                        >
                            {strings.menu.pricing}
                        </Link>
                        <Link
                            to={routes.offers.route}
                            id={selectedItem(props.location.pathname, routes.offers.route)}
                        >
                            {strings.menu.offer}
                        </Link>
                        <Link
                            to={routes.blogs.route}
                            id={selectedItem(props.location.pathname, routes.blogs.route)}
                        >
                            {strings.menu.blog}
                        </Link>
                        <Link
                            to={routes.contact.route}
                            id={selectedItem(props.location.pathname, routes.contact.route)}
                        >
                            {strings.menu.contact}
                        </Link>
                        <Link
                            to={routes.links.route}
                            id={selectedItem(props.location.pathname, routes.links.route)}
                        >
                            {strings.menu.links}
                        </Link>
                        <Link
                            to={routes.videos.route}
                            id={selectedItem(props.location.pathname, routes.videos.route)}
                        >
                            {strings.menu.videos}
                        </Link>
                        <Link id="gallery" to={routes.private.route}>{strings.menu.private}</Link>
                    </nav>
                </div>
                <div className="logo">
                    <div className="top">
                        <span>PYSZ</span>
                        <span>STUDIO</span>
                    </div>
                    <div className="bottom">FOTOGRAFIA I FILM</div>
                </div>
            </header></>
    );
});
