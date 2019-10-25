import * as React from "react";
import { strings } from "../resources";
import { routes } from "../routes";
import { Link } from "react-router-dom";
import { getLastBlog, LastBlog } from "../../../api/get-last-blog";
import mapImage from "../images/map.png";
import photographerImage from "../images/address_ph.png";

type HomeProps = { initialState?: LastBlog };
type HomeState = { lastBlog?: LastBlog };

export class Home extends React.Component<HomeProps, HomeState> {
    state = this.props.initialState !== undefined ? { lastBlog: this.props.initialState } : { lastBlog: undefined };

    componentDidMount() {
        if (this.state.lastBlog === undefined) {
            getLastBlog().then(lastBlog => this.setState({ lastBlog }));
        }
    }

    render() {
        console.log(this.state);
        return (
            <>
                <div className="offer">
                    <section>
                        <h1 dangerouslySetInnerHTML={{ __html: strings.offer.title }}></h1>
                        <h2>{strings.offer.description}</h2>

                        <article>
                            <h1>{strings.offer.middle.title}</h1>
                            <h2>{strings.offer.middle.description}</h2>

                            <Link to={routes.offer.route} className="button">
                                {strings.offer.middle.more}
                            </Link>
                        </article>

                        <hgroup>
                            <ul id="left">
                                {strings.offer.advantages.slice(0, 4).map(adv => (
                                    <li key={adv}>{adv}</li>
                                ))}
                            </ul>
                            <ul id="right">
                                {strings.offer.advantages.slice(4).map(adv => (
                                    <li key={adv}>{adv}</li>
                                ))}
                            </ul>
                        </hgroup>
                    </section>
                </div>

                <div className="article">
                    <section>
                        <h1 dangerouslySetInnerHTML={{ __html: strings.article.title }}></h1>
                        <h2>{strings.article.description}</h2>

                        <article>
                            {this.state.lastBlog !== undefined ? (
                                <a href="{$base_url}blog/{$blog->alias}">
                                    <h1>{this.state.lastBlog.title}</h1>
                                    <h2>{this.state.lastBlog.content.slice(0, 220)}...</h2>
                                </a>
                            ) : null}

                            <Link to={routes.blog.route} className="button">
                                {strings.article.more}
                            </Link>
                        </article>

                        <hgroup>
                            <img src={mapImage} alt="mazowsze_map" id="map" />
                        </hgroup>
                    </section>
                </div>

                <div className="contact">
                    <section>
                        <div id="left">
                            <h1>{strings.contact.slogan.title}</h1>
                            <h2>{strings.contact.slogan.description}</h2>
                        </div>

                        <div id="right">
                            <h1>{strings.contact.email}</h1>
                            <h2>{strings.contact.phone}</h2>
                        </div>
                    </section>
                </div>
                <div className="map">
                    <section>
                        <address>
                            <ul>
                                {strings.contact.address.map(addr => (
                                    <li key={addr}>{addr}</li>
                                ))}
                            </ul>
                            <img src={photographerImage} alt="Adres siedziby PyszStudio - Andrychów" />
                        </address>
                    </section>
                </div>
            </>
        );
    }
}
