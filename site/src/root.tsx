import * as React from "react";
import { Blog } from "./areas/blog";
import { Blogs } from "./areas/blogs";
import { Contact } from "./areas/contact";
import { Footer } from "./layouts/footer";
import { Head } from "./layouts/head";
import { Header } from "./layouts/header";
import { Home } from "./areas/home";
import { Links } from "./areas/links";
import { Offer } from "./areas/offer";
import { Offers } from "./areas/offers";
import { PrivateGallery } from "./areas/private-gallery";
import { Route, Switch } from "react-router-dom";
import { routes } from "./routes";
import { Slogan } from "./layouts/slogan";

export const Root = ({ initialState }: { initialState?: any }) => (
    <>
        <Header />
        <Slogan />
        <span>
            <Switch>
                <Route
                    exact
                    path={routes.home.route}
                    render={() => <Home initialState={initialState[routes.home.route]} />}
                />
                <Route exact path={routes.offers.route} render={()=><Offers initialState={initialState[routes.offers.route]}/>} />
                <Route path={routes.offer.route} render={x => <Offer alias={x.match.params.alias} />} />
                <Route
                    exact
                    path={routes.blogs.route}
                    render={() => <Blogs initialState={initialState[routes.blogs.route]} />}
                />
                <Route
                    exact
                    path={routes.blog.route}
                    render={x => <Blog alias={x.match.params.alias} initialState={initialState[routes.blog.route]} />}
                />
                <Route exact path={routes.contact.route} render={() => <Contact />} />
                <Route exact path={routes.gallery.route} render={() => <h1>{routes.gallery.label}</h1>} />
                <Route exact path={routes.links.route} render={() => <Links />} />
                <Route exact path={routes.movies.route} render={() => <h1>{routes.movies.label}</h1>} />
                <Route exact path={routes.private.route} render={() => <PrivateGallery />} />
            </Switch>
        </span>
        <Footer />
    </>
);
