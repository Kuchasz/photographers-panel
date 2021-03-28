import * as React from "react";
import mapImage from "../images/map.png";
import { getLastBlogs, BlogListItem } from "@pp/api/site/blog";
import { Link } from "react-router-dom";
import { routes } from "@pp/api/site/routes";
import { strings } from "../resources";
import { truncate } from "@pp/utils/string";

type HomeProps = { initialState?: BlogListItem[] };
type HomeState = { lastBlogs?: BlogListItem[] };

export class Home extends React.Component<HomeProps, HomeState> {
    state = this.props.initialState !== undefined ? { lastBlogs: this.props.initialState } : { lastBlogs: [] };

    componentDidMount() {
        if (this.state.lastBlogs.length === 0) {
            getLastBlogs().then(lastBlogs => this.setState({ lastBlogs }));
        }
    }

    getBlogUrl(index: number) { return `/blog/${this.state.lastBlogs[index].alias}` }
    getBlogTitle(index: number) { return this.state.lastBlogs[index].title }

    render() {
        return (
            <>
                <div className="offer">
                    <section>
                        <h1 dangerouslySetInnerHTML={{ __html: strings.offer.slogan.title }}></h1>
                        <h2>{strings.offer.slogan.description}</h2>

                        <article>
                            <h1>{strings.offer.slogan.middle.title}</h1>
                            <h2>{strings.offer.slogan.middle.description}</h2>

                            <Link to={routes.offers.route} className="button">
                                {strings.offer.slogan.middle.more}
                            </Link>
                        </article>

                        <hgroup>
                            <ul className="left">
                                {strings.offer.slogan.advantages.slice(0, 4).map(adv => (
                                    <li key={adv}>{adv}</li>
                                ))}
                            </ul>
                            <ul className="right">
                                {strings.offer.slogan.advantages.slice(4).map(adv => (
                                    <li key={adv}>{adv}</li>
                                ))}
                            </ul>
                        </hgroup>
                    </section>
                </div>
                <div className="promo-blogs">
                    {this.state.lastBlogs.length > 0 ? <>
                        <Link to={this.getBlogUrl(2)} style={{ gridRow: 1, gridColumn: 1 }}>
                            <img src={this.state.lastBlogs[2].photoUrl} alt={this.state.lastBlogs[2].photoAlt}></img>
                        </Link>
                        <Link to={this.getBlogUrl(3)} style={{ gridRow: 2, gridColumn: 1 }}>
                            <img src={this.state.lastBlogs[3].photoUrl} alt={this.state.lastBlogs[3].photoAlt}></img></Link>
                        <Link to={this.getBlogUrl(4)} style={{ gridRow: 1, gridColumn: 2 }}>
                            <img src={this.state.lastBlogs[4].photoUrl} alt={this.state.lastBlogs[4].photoAlt}></img></Link>
                        <Link to={this.getBlogUrl(5)} style={{ gridRow: 2, gridColumn: 2 }}>
                            <img src={this.state.lastBlogs[5].photoUrl} alt={this.state.lastBlogs[5].photoAlt}></img></Link>
                        <Link to={this.getBlogUrl(0)} className="main" style={{ gridRow: "1 / span 2", gridColumn: "3 / span 2" }}>
                            <div className="overlay">{this.getBlogTitle(0)}</div>
                            <img src={this.state.lastBlogs[0].photoUrl} alt={this.state.lastBlogs[0].photoAlt}></img>
                        </Link>
                        <Link to={this.getBlogUrl(1)} className="main" style={{ gridRow: "1 / span 2", gridColumn: "5 / span 2" }}>
                            <div className="overlay">{this.getBlogTitle(1)}</div>
                            <img src={this.state.lastBlogs[1].photoUrl} alt={this.state.lastBlogs[1].photoAlt}></img>
                        </Link>
                        <Link to={this.getBlogUrl(6)} style={{ gridRow: 1 }}>
                            <img src={this.state.lastBlogs[6].photoUrl} alt={this.state.lastBlogs[6].photoAlt}></img></Link>
                        <Link to={this.getBlogUrl(7)} style={{ gridRow: 2 }}>
                            <img src={this.state.lastBlogs[7].photoUrl} alt={this.state.lastBlogs[7].photoAlt}></img></Link>
                        <Link to={this.getBlogUrl(8)} style={{ gridRow: 1 }}>
                            <img src={this.state.lastBlogs[8].photoUrl} alt={this.state.lastBlogs[8].photoAlt}></img></Link>
                        <Link to={this.getBlogUrl(9)} style={{ gridRow: 2 }}>
                            <img src={this.state.lastBlogs[9].photoUrl} alt={this.state.lastBlogs[9].photoAlt}></img></Link></> : null}
                </div>
                <div className="article">
                    <section>
                        <h1 dangerouslySetInnerHTML={{ __html: strings.article.title }}></h1>
                        <h2>{strings.article.description}</h2>

                        <article>
                            <span>
                                {this.state.lastBlogs[0] !== undefined ? (
                                    <Link to={this.getBlogUrl(0)}>
                                        <h1>{this.state.lastBlogs[0].title}</h1>
                                        <h2>{truncate(220, this.state.lastBlogs[0].content)}...</h2>
                                    </Link>
                                ) : null}
                            </span>

                            <Link to={routes.blogs.route} className="button">
                                {strings.article.more}
                            </Link>
                        </article>

                        <hgroup>
                            <img width="450" height="344" src={mapImage} alt="malopolskie_map" id="map" />
                        </hgroup>
                    </section>
                </div>
                <div className="contact">
                    <section>
                        <div className="left">
                            <h1>{strings.contact.slogan.title}</h1>
                            <h2>{strings.contact.slogan.description}</h2>
                        </div>

                        <div className="right">
                            <h1>{strings.contact.email}</h1>
                            <h2>{strings.contact.phone}</h2>
                        </div>
                    </section>
                </div>

                <div className="map">
                    <section>
                        <div className="address-pointer"></div>
                        <address>
                            {strings.contact.address.map(addr => (
                                <div className="address-line" key={addr}>{addr}</div>
                            ))}
                        </address>
                    </section>
                </div>
            </>
        );
    }
}
