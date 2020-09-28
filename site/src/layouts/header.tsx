import React, { useEffect } from "react";
import { strings } from "../resources";
import { randomElement, first, nextElement, last } from "../../../utils/array";
import { firstSegment } from "../../../utils/url";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { routes } from "../routes";
import { menuItems } from "../menu-items";

const getHeaderBackgroundStyle = (photo: string) => {
    const url = require(`../images/top/${photo}`);
    return {
        backgroundImage: `url(${url})`
    };
};

const selectedItem = (selectedPath: string, path: string) =>
    firstSegment(selectedPath) === path ? "current" : undefined;

export const Header = withRouter(props => {
    const [{ currentPhoto, prevPhoto }, setCurrentPhoto] = React.useState({
        prevPhoto: last(strings.main.topPhotos),
        currentPhoto: first(strings.main.topPhotos)
    }); //randomElement(strings.main.topPhotos);
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
        <header
            id={
                first(menuItems, mi => firstSegment(props.location.pathname) === mi.route).fullPage ? "home" : "subpage"
            }
            // style={getHeaderBackgroundStyle(chosenPhoto)}
        >
            <div className="background">
                <div className="previous" style={getHeaderBackgroundStyle(prevPhoto)}></div>
                <div key={currentPhoto} className="current" style={getHeaderBackgroundStyle(currentPhoto)}></div>
                {/* {strings.main.topPhotos.map(p => (
                    <div key={p} style={getHeaderBackgroundStyle(p)}></div>
                ))} */}
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
                    <ul>
                        <li>
                            <Link to={routes.home.route} id={selectedItem(props.location.pathname, routes.home.route)}>
                                {strings.menu.home}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={routes.offers.route}
                                id={selectedItem(props.location.pathname, routes.offers.route)}
                            >
                                {strings.menu.offer}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={routes.blogs.route}
                                id={selectedItem(props.location.pathname, routes.blogs.route)}
                            >
                                {strings.menu.blog}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={routes.contact.route}
                                id={selectedItem(props.location.pathname, routes.contact.route)}
                            >
                                {strings.menu.contact}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={routes.links.route}
                                id={selectedItem(props.location.pathname, routes.links.route)}
                            >
                                {strings.menu.links}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={routes.videos.route}
                                id={selectedItem(props.location.pathname, routes.videos.route)}
                            >
                                {strings.menu.videos}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <nav id="gallery">
                    <Link to={routes.private.route}>{strings.menu.private}</Link>
                </nav>
            </div>
            <div className="logo">
                <div className="top">
                    <span>PYSZ</span>
                    <span>STUDIO</span>
                </div>
                <div className="bottom">FOTOGRAFIA I FILM</div>
            </div>
        </header>
    );
});
