import { routes } from "@pp/api/dist/site/routes";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { Blog } from "./areas/blog";
import { Blogs } from "./areas/blogs";
import { Contact } from "./areas/contact";
import { Home } from "./areas/home";
import { Offer } from "./areas/offer";
import { Offers } from "./areas/offers";
import { PrivateGallery } from "./areas/private-gallery";
import { Videos } from "./areas/videos";
import { Headers } from "./components/headers";
import { Footer } from "./layouts/footer";
import { Header } from "./layouts/header";

export const Root = ({ initialState }: { initialState?: any }) => (
    <>
        <Headers />
        <Header />
        <span>
            <Switch>
                <Route
                    exact
                    path={routes.home.route}
                    render={() => <Home initialState={initialState[routes.home.route]} />}
                />
                {/*<Route exact path={routes.pricing.route} render={() => <Pricing />} />*/}
                <Route
                    exact
                    path={routes.offers.route}
                    render={() => <Offers initialState={initialState[routes.offers.route]} />}
                />
                <Route
                    path={routes.offer.route}
                    render={(x) => (
                        <Offer alias={x.match.params.alias!} initialState={initialState[routes.offer.route]} />
                    )}
                />
                <Route
                    exact
                    path={routes.blogs.route}
                    render={() => <Blogs initialState={initialState[routes.blogs.route]} />}
                />
                <Route
                    exact
                    path={routes.blog.route}
                    render={(x) => (
                        <Blog alias={x.match.params.alias!} initialState={initialState[routes.blog.route]} />
                    )}
                />
                <Route exact path={routes.contact.route} render={() => <Contact />} />
                <Route
                    exact
                    path={routes.videos.route}
                    render={() => <Videos initialState={initialState[routes.videos.route]} />}
                />
                <Route exact path={routes.private.route} render={() => <PrivateGallery />} />
            </Switch>
        </span>
        <Footer />
    </>
);
