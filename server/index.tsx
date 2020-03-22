// import React from "react";
import express from "express";
import compression from 'compression';

import { randomElement } from "../utils/array";
//import { renderToString } from "react-dom/server";
// import { matchPath, StaticRouter } from "react-router";
import * as blogModel from "./src/models/blog";
import * as messageModel from "./src/models/message";
import * as privateGalleryModel from "./src/models/private-gallery";
import * as emailModel from "./src/models/email";
import * as notificationModel from "./src/models/notification";
import Root from "../site/dist/bundle.js";
import * as blog from "../api/site/blog";
import * as blogPanel from "../api/panel/blog";
import * as offer from "../api/site/offer";
import * as video from "../api/site/video";
import fs from "fs";
import path from "path";
import { routes } from "../site/src/routes";
import * as message from "../api/site/message";
import * as notification from "../api/site/notification";
import * as privateGallery from "../api/site/private-gallery";
import * as privateGalleryPanel from "../api/panel/private-gallery";
import { ResultType } from "../api/common";
import { sendEmail } from "./src/messages";
import { allowCrossDomain } from "./src/core";
require("isomorphic-fetch");
const Youch = require("youch");

// import Home from "../site/src/areas/home";

// mail.send(msg);




const app = express();
app.use(express.json());
app.use(compression());
app.use(allowCrossDomain);

const raiseErr = (err: Error, req: any, res: any) => {
    const youch = new Youch(err, req);

    youch.toHTML().then((html: string) => {
        res.writeHead(200, { "content-type": "text/html" });
        res.write(html);
        res.end();
    });
};

app.use(express.static("../site/dist", { index: false }));

app.get(blog.getLastBlog.route, async (_req, res) => {
    const blog = await blogModel.getMostRecent();
    res.json(blog);
});

app.get(blog.getBlogsList.route, async (_req, res) => {
    const blogs = await blogModel.getList();
    res.json(blogs);
});

app.get(blog.getBlog.route, async (req, res) => {
    const blog = await blogModel.get(req.params.alias);
    res.json(blog);
});

app.get(blogPanel.getBlogSelectList.route, async (req, res) => {
    const blogs = await blogModel.getSelectList();
    res.json(blogs);
});

app.post(message.send.route, async (req, res) => {
    const mesg = req.body as message.Message;

    const error = messageModel.validate(mesg);

    if (error) {
        res.json({ type: ResultType.Error, error: error });
        return;
    }

    try {
        await sendEmail(mesg.name, mesg.email, mesg.content);
        res.json({ type: ResultType.Success });
    } catch {
        res.json({ type: ResultType.Error, error: "InternalError" });
    }
});

app.get(privateGallery.getGalleryUrl.route, async (req, res) => {
    const gallery = await privateGalleryModel.getUrl(req.params.password);

    res.json(gallery);
});

app.get(privateGalleryPanel.getGalleriesList.route, async (req, res) => {
    const galleries = await privateGalleryModel.getList();
    res.json(galleries);
});

app.get(privateGalleryPanel.getGalleryVisits.route, async (req, res) => {
    const galleries = await privateGalleryModel.getStats(Number.parseInt(req.params.galleryId), new Date(req.params.start), new Date(req.params.end));
    res.json(galleries);
});

app.get(privateGalleryPanel.checkPasswordIsUnique.route, async (req, res) => {
    const passwordUnique = await privateGalleryModel.checkPasswordIsUnique(req.params.password);
    res.json(passwordUnique);
});

app.post(notification.subscribeForNotification.route, async (req, res) => {
    let result: notification.SubscribtionResult | undefined = undefined;

    var emailIsValid = emailModel.validate(req.body.email);
    if (!emailIsValid) result = { type: ResultType.Error, error: "EmailInvalid" };

    const galleryExists = await privateGalleryModel.exists(req.body.privateGalleryId);
    if (galleryExists === false) result = { type: ResultType.Error, error: "GalleryDoesNotExists" };

    const subscribtionExists = await notificationModel.alreadySubscribed(req.body);
    if (subscribtionExists === true) result = { type: ResultType.Error, error: "AlreadySubscribed" };

    if (result == undefined) {
        await notificationModel.subscribe(req.body);
        result = { type: ResultType.Success };
    }

    setTimeout(() => {
        res.json(result);
    }, 1500);
});

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nAllow: /");
});

app.get("*", async (req, res) => {
    //routes.home

    let desiredRoute: { route: string };
    let initialState: any;

    try {
        const found = Object.values(routes).filter(p => Root.matchPath(req.path, { path: p.route, exact: true }))[0];
        const match = Root.matchPath(req.path, { path: found.route });

        desiredRoute = { route: found.route };
        initialState = found ? await found.getData(match ? (match.params as any).alias : null) : undefined;

        console.log(match);
    } catch (err) {
        raiseErr(err, req, res);
        return;
    }

    fs.readFile(path.resolve("../site/dist/index.html"), "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred");
        }

        let siteContent = "";
        const context = {};

        const app = Root.createElement(
            Root.StaticRouter,
            { location: req.url, context },
            Root.createElement(Root.Root, { initialState: { [desiredRoute.route]: initialState } }, null)
        );

        try {
            siteContent = Root.renderToString(app);
        } catch (err) {
            raiseErr(err, req, res);
            return;
        }

        return res.send(
            data.replace('<div id="root"></div>', `<div id="root">${siteContent}</div>`).replace(
                "{initial_state}",
                `<script type="text/javascript">window.___InitialState___=${JSON.stringify({
                    [desiredRoute.route]: initialState
                })}</script>`
            )
        );
    });
});

app.listen(8080, () => {
    console.log("Photographers-panel server started");
});
