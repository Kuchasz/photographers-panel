import React from "react";
import { strings } from "../resources";
import { randomElement, first } from "../../../utils/array";
import { Link, withRouter } from "react-router-dom";
import { routes, menuItems } from "../routes";

const logo = require("../images/logo.png");

const getHeaderBackgroundStyle = () => {
    const chosenPhoto = randomElement(strings.main.topPhotos);
    const url = require(`../images/top/${chosenPhoto}`);
    return {
        backgroundImage: `url(${url})`
    };
}

const selectedItem = (selectedPath: string, path: string) => selectedPath === path ? "current" : undefined;

export const Header = withRouter(props => <header id={first(menuItems, mi => mi.route === props.location.pathname).fullPage ? "home" : "subpage"} style={getHeaderBackgroundStyle()}>
    <nav>
        <ul>
            <li><Link to={routes.home.route} id={selectedItem(props.location.pathname, routes.home.route)}>{strings.menu.home}</Link></li>
            <li><Link to={routes.offer.route} id={selectedItem(props.location.pathname, routes.offer.route)}>{strings.menu.offer}</Link></li>
            <li><Link to={routes.blog.route} id={selectedItem(props.location.pathname, routes.blog.route)}>{strings.menu.blog}</Link ></li>
            <li><Link to={routes.contact.route} id={selectedItem(props.location.pathname, routes.contact.route)}>{strings.menu.contact}</Link ></li>
        </ul>
    </nav>

    <nav id="logo">
        <img src={logo} alt="logo PyszStudio" />
    </nav>

    <nav id="menu_down">
        <ul>
            <li><Link to={routes.gallery.route} id={selectedItem(props.location.pathname, routes.gallery.route)}>{strings.menu.gallery}</Link ></li>
            <li><Link to={routes.links.route} id={selectedItem(props.location.pathname, routes.links.route)}>{strings.menu.links}</Link ></li>
            <li><Link to={routes.movies.route} id={selectedItem(props.location.pathname, routes.movies.route)}>{strings.menu.movies}</Link ></li>
        </ul>
    </nav>

    <div id="gallery">
        <Link to={routes.private.route}>{strings.menu.private}</Link>
    </div>

</header>);