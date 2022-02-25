import React from "react";
import { getYear } from "@pp/utils/dist/date";
import { strings } from "../resources";
// import { Link } from "react-router";
// import { menuItems } from "../menuItems";

const year = getYear(new Date());

export const Footer = () => (
    <footer>
        <section>
            <div className="left">
                <h1>
                    © {year} {strings.footer.copyrights}
                </h1>
                <ul>
                    {/* {menuItems.map((mi, index) => <li key={mi.route}><Link to={mi.route}>{mi.label}</Link> {index < menuItems.length -1 ? ' / ' : undefined }</li>)} */}
                </ul>
            </div>
            <div className="right">
                <h1>{strings.footer.socialMedia.header}</h1>
                <ul>
                    <li>
                        <a href={strings.footer.socialMedia.url.facebook} rel="noopener" target="_blank">
                            {strings.footer.socialMedia.facebook}
                        </a>{' '}
                        /
                    </li>
                    <li>
                        <a href={strings.footer.socialMedia.url.youtube} rel="noopener" target="_blank">
                            {strings.footer.socialMedia.youtube}
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    </footer>
);
