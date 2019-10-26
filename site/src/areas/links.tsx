import * as React from "react";
import { strings } from "../resources";

import linkPhoto from "../images/link_foto.png";

type LinksProps = {};
type LinksState = {};

export class Links extends React.Component<LinksProps, LinksState> {
    render() {
        return (
            <div className="link">
                <section>
                    <article>
                        <h1>{strings.link.title}</h1>
                        <h2>{strings.link.description}</h2>

                        <a href="kontakt" className="button">
                        {strings.link.contactNow}
                        </a>

                        <h3>{strings.link.linksHeader}</h3>

                        <ul>
                            {strings.link.links.map(l => (
                                <li key={l.url}>
                                    <a href={`http://${l.url}`} target="_blank">
                                        {l.label} - {l.url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <hgroup>
                        <img src={linkPhoto} alt="" />
                    </hgroup>
                </section>
            </div>
        );
    }
}
