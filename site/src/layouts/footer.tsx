import React from "react";
import { strings } from "../resources";
// import { Link } from "react-router";
import { menuItems } from "../routes";

export const Footer = () => <footer>
    <section>
        <div id="left">
            <h1>{strings.footer.copyrights}</h1>
            <ul>
                {/* {menuItems.map((mi, index) => <li key={mi.route}><Link to={mi.route}>{mi.label}</Link> {index < menuItems.length -1 ? ' / ' : undefined }</li>)} */}
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