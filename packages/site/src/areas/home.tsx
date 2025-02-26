import * as React from "react";
import mapImage from "../images/map.png";
import { getLastBlogs, MostRecentBlogListItem } from "@pp/api/dist/site/blog";
import { Link } from "react-router";
import { routes } from "@pp/api/dist/site/routes";
import { strings } from "../resources";
// import { truncate } from "@pp/utils/dist/string";

type HomeProps = { initialState?: MostRecentBlogListItem[] };

export const Home = ({ initialState }: HomeProps) => {
    const [lastBlogs, setLastBlogs] = React.useState<MostRecentBlogListItem[]>(initialState || []);

    React.useEffect(() => {
        if (lastBlogs.length === 0) {
            getLastBlogs().then(setLastBlogs);
        }
    }, []);

    const getBlogUrl = (blog: MostRecentBlogListItem) => {
        return `/blog/${blog.alias}`;
    };

    const mostRecentBlog = lastBlogs.filter((x) => !x.isMain)[0];

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
                            {strings.offer.slogan.advantages.slice(0, 4).map((adv) => (
                                <li key={adv}>{adv}</li>
                            ))}
                        </ul>
                        <ul className="right">
                            {strings.offer.slogan.advantages.slice(4).map((adv) => (
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

                    {/* <article>
                            <span>
                                {mostRecentBlog !== undefined ? (
                                    <Link to={this.getBlogUrl(mostRecentBlog)}>
                                        <h1>{mostRecentBlog.title}</h1>
                                        <h2>{truncate(220, mostRecentBlog.content)}...</h2>
                                    </Link>
                                ) : null}
                            </span>

                            <Link to={routes.blogs.route} className="button">
                                {strings.article.more}
                            </Link>
                        </article> */}

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
                        {strings.contact.address.map((addr) => (
                            <div className="address-line" key={addr}>
                                {addr}
                            </div>
                        ))}
                    </address>
                </section>
            </div>
        </>
    );
};
