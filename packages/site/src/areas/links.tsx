import * as React from 'react';
import linkPhoto from '../images/page_links_photo.png';
import { Link } from 'react-router-dom';
import { strings } from '../resources';

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

                        <Link to="/kontakt" className="button">
                            {strings.link.contactNow}
                        </Link>

                        <h3>{strings.link.linksHeader}</h3>

                        <ul>
                            {strings.link.links.map((l) => (
                                <li key={l.url}>
                                    <a href={l.url} target="_blank">
                                        {l.label}
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
