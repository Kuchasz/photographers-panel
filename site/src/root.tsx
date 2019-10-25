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

export const Root = ({initialState}: {initialState?: any}) => (
    <>
        <Header />
        <Slogan />
        <span>
            <Switch>
                <Route exact path={routes.home.route} render={() => <Home initialState={initialState} />} />
                <Route exact path={routes.offer.route} component={Offers} />
                <Route path={`${routes.offer.route}/:alias`} render={x => <Offer alias={x.match.params.alias} />} />
                <Route exact path={routes.blog.route} render={() => <h1>{routes.blog.label}</h1>} />
                <Route exact path={routes.contact.route} render={() => <h1>{routes.contact.label}</h1>} />
                <Route exact path={routes.gallery.route} render={() => <h1>{routes.gallery.label}</h1>} />
                <Route exact path={routes.links.route} render={() => <h1>{routes.links.label}</h1>} />
                <Route exact path={routes.movies.route} render={() => <h1>{routes.movies.label}</h1>} />
                <Route exact path={routes.private.route} render={() => <h1>{routes.private.label}</h1>} />
            </Switch>
        </span>
        <Footer />
    </>
);