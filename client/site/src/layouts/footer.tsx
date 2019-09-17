import React from "react";
import {strings} from "../resources";
const baseUrl = "";

const urlOf = (path: string) => `${baseUrl}/${path}`;

export const Footer = () => <footer>
    <section>
        <div id="left">
            <h1>{strings.footer.copyrights}</h1>
            <ul>
                <li><a href={urlOf("")}>{strings.menu.home}</a> /</li>
                <li><a href={urlOf("/oferta")}>{strings.menu.offer}</a> /</li>
                <li><a href={urlOf("/galeria")}>{strings.menu.gallery}</a> /</li>
                <li><a href={urlOf("/kontakt")}>{strings.menu.contact}</a> /</li>
                <li><a href={urlOf("/link")}>{strings.menu.link}</a> /</li>
                <li><a href={urlOf("/filmy")}>{strings.menu.movie}</a> /</li>
                <li><a href={urlOf("/blog")}>{strings.menu.blog}</a></li>
            </ul>
        </div>
        <div id="right">
            <h1>{strings.footer.socialMedia.header}</h1>
            <ul>
                <li><a href={strings.footer.socialMedia.url.facebook} target="_blank">{strings.footer.socialMedia.facebook}</a> /</li>
                <li><a href={strings.footer.socialMedia.url.youtube} target="_blank">{strings.footer.socialMedia.youtube}</a></li>
            </ul>
        </div>
    </section>
</footer>;