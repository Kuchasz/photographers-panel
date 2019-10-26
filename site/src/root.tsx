import * as React from "react";
import { Head } from "./layouts/head";
import { Header } from "./layouts/header";
import { Slogan } from "./layouts/slogan";
import { Footer } from "./layouts/footer";
import { Route, Switch } from "react-router-dom";
import { routes } from "./routes";
import { Home } from "./areas/home";
import { Offers } from "./areas/offers";
import { Offer } from "./areas/offer";
import { Blogs } from "./areas/blogs";
import { Blog } from "./areas/blog";
import { Contact } from "./areas/contact";
import {Links} from "./areas/links";

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
                <Route exact path={routes.offer.route} component={Offers} />
                <Route path={`${routes.offer.route}/:alias`} render={x => <Offer alias={x.match.params.alias} />} />
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
                <Route exact path={routes.contact.route} render={() => <Contact/>} />
                <Route exact path={routes.gallery.route} render={() => <h1>{routes.gallery.label}</h1>} />
                <Route exact path={routes.links.route} render={() => <Links/>} />
                <Route exact path={routes.movies.route} render={() => <h1>{routes.movies.label}</h1>} />
                <Route exact path={routes.private.route} render={() => <h1>{routes.private.label}</h1>} />
            </Switch>
        </span>
        <Footer />
    </>
);
