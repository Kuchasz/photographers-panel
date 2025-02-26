import { routes } from "@pp/api/dist/site/routes";
import * as React from "react";
import { Route, Switch, useParams } from "react-router-dom";
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

// Wrapper components to handle route params
const OfferWithParams = ({ initialState }: { initialState: any }) => {
    const { alias } = useParams();
    return <Offer alias={alias!} initialState={initialState} />;
};

const BlogWithParams = ({ initialState }: { initialState: any }) => {
    const { alias } = useParams();
    return <Blog alias={alias!} initialState={initialState} />;
};

export const Root = ({ initialState }: { initialState?: any }) => (
    <>
        <Headers />
        <Header />
        <span>
            <Switch>
                <Route path={routes.home.route}><Home initialState={initialState?.[routes.home.route]} /></Route>
                <Route path={routes.offers.route}><Offers initialState={initialState?.[routes.offers.route]} /></Route>
                <Route path={routes.offer.route}><OfferWithParams initialState={initialState?.[routes.offer.route]} /></Route>
                <Route path={routes.blog.route}><BlogWithParams initialState={initialState?.[routes.blog.route]} /></Route>
                <Route path={routes.contact.route}><Contact /></Route>
                <Route path={routes.videos.route}><Videos initialState={initialState?.[routes.videos.route]} /></Route>
                <Route path={routes.private.route}><PrivateGallery /></Route>
            </Switch>
        </span>
        <Footer />
    </>
);
