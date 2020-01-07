import React, { useEffect } from "react";
import { strings } from "../resources";
import { randomElement, first, nextElement } from "../../../utils/array";
import { firstSegment } from "../../../utils/url";
import { Link, withRouter } from "react-router-dom";
import { routes, menuItems } from "../routes";
import logo from "../images/logo.png";
import logoWatermark from "../images/logoWatermark.png";

const getHeaderBackgroundStyle = (photo: string) => {
    const url = require(`../images/top/${photo}`);
    return {
        backgroundImage: `url(${url})`
    };
};

const selectedItem = (selectedPath: string, path: string) =>
    firstSegment(selectedPath) === path ? "current" : undefined;

export const Header = withRouter(props => {
    //const [chosenPhoto, setChosenPhoto] = React.useState(strings.main.topPhotos[0]); //randomElement(strings.main.topPhotos);

    return (
        <header
            id={
                first(menuItems, mi => firstSegment(props.location.pathname) === mi.route).fullPage ? "home" : "subpage"
            }
            // style={getHeaderBackgroundStyle(chosenPhoto)}
        >
            <div className="background">
                {strings.main.topPhotos.map(p => (
                    <div key={p} style={getHeaderBackgroundStyle(p)}></div>
                ))}
            </div>
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
                                to={routes.gallery.route}
                                id={selectedItem(props.location.pathname, routes.gallery.route)}
                            >
                                {strings.menu.gallery}
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
                                to={routes.movies.route}
                                id={selectedItem(props.location.pathname, routes.movies.route)}
                            >
                                {strings.menu.movies}
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
