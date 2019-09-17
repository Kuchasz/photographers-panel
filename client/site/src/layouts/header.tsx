import React from "react";
import { strings } from "../resources";
import { randomElement } from "../../../../utils/array";

const menuItem = "home";

const baseUrl = "";
const urlOf = (path: string) => `${baseUrl}/${path}`;

const getHeaderBackgroundStyle = () => {
    const chosenPhoto = randomElement(strings.main.topPhotos);
    const url = `base_url/media/images/top/${chosenPhoto}`;
    return {
        backgroundImage: `url(${url})`
    };
}

const selectedItem = (selectedMenuItem: string) => menuItem === selectedMenuItem ? "current" : undefined;

export const Header = () => <header id={menuItem === "home" ? "subpage" : undefined} style={getHeaderBackgroundStyle()}>
    <nav>
        <ul>
            <li><a href={urlOf("")} id={selectedItem('home')}>{strings.menu.home}</a ></li>
            <li><a href={urlOf("oferta")} id={selectedItem("offer")}>{strings.menu.offer}</a ></li>
            <li><a href={urlOf("blog")} id={selectedItem("blog")}>{strings.menu.blog}</a ></li>
            <li><a href={urlOf("kontakt")} id={selectedItem("contact")}>{strings.menu.contact}</a ></li>
        </ul>
    </nav>

    <nav id="logo">
        <img src="{$base_url}media/images/logo.png" alt="logo PyszStudio" />
    </nav>

    <nav id="menu_down">
        <ul>
            <li><a href={urlOf("galeria")} id={selectedItem('gallery')}>{strings.menu.gallery}</a ></li>
            <li><a href={urlOf("link")} id={selectedItem('link')}>{strings.menu.link}</a ></li>
            <li><a href={urlOf("filmy")} id={selectedItem('video')}>{strings.menu.movie}</a ></li>
        </ul>
    </nav>

    <div id="gallery">
        <a href={urlOf("prywatna")}>{strings.menu.privateGallery}</a>
    </div>

</header>