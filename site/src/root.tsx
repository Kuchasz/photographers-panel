import React from "react";
import { Head } from "./layouts/head";
import { Header } from "./layouts/header";
import { Slogan } from "./layouts/slogan";
import { Footer } from "./layouts/footer";
import { Route } from "react-router";
import { routes } from "./routes";
    
export const Root = () => <>
    <Header />
    <Slogan />
    <span>
        <Route exact path={routes.home.route} render={()=><h1>{routes.home.label}</h1>}/>
        <Route exact path={routes.offer.route} render={()=><h1>{routes.offer.label}</h1>}/>
        <Route exact path={routes.blog.route} render={()=><h1>{routes.blog.label}</h1>}/>
        <Route exact path={routes.contact.route} render={()=><h1>{routes.contact.label}</h1>}/>
        <Route exact path={routes.gallery.route} render={()=><h1>{routes.gallery.label}</h1>}/>
        <Route exact path={routes.links.route} render={()=><h1>{routes.links.label}</h1>}/>
        <Route exact path={routes.movies.route} render={()=><h1>{routes.movies.label}</h1>}/>
        <Route exact path={routes.private.route} render={()=><h1>{routes.private.label}</h1>}/>
    </span>
    <Footer />
</>;