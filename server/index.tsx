import React from "react";
import express from "express";
import { randomElement } from "../utils/array";
import { renderToString } from "react-dom/server";
import { matchPath, StaticRouter } from "react-router";
import * as blogModel from "./src/models/blog";
import * as messageModel from "./src/models/message";
import * as privateGalleryModel from "./src/models/private-gallery";
import Root from "../site/dist/bundle.js";
import * as blog from "../api/blog";
import fs from "fs";
import path from "path";
import { routes } from "../site/src/routes";
import * as sendMessage from "../api/send-message";
import * as subscribeForNotification from "../api/subscribe-for-notification";
import * as getPrivateGalleryUrl from "../api/get-private-gallery-url";
import { ResultType } from "../api/common";
require("isomorphic-fetch");
const Youch = require("youch");

// import Home from "../site/src/areas/home";

const app = express();
app.use(express.json());

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

app.post(sendMessage.route, async (req, res) => {
    const error = messageModel.validate(req.body);
    const result: sendMessage.MessageSendResult = error
        ? { type: ResultType.Error, error }
        : { type: ResultType.Success };

    setTimeout(() => {
        res.json(result);
    }, 500);
});

app.get(getPrivateGalleryUrl.route, async (req, res) => {
    const gallery = await privateGalleryModel.getUrl(req.params.password);

    res.json(gallery);
});

app.post(subscribeForNotification.route, async (req, res) => {

    const foo = privateGalleryModel.exists(req.body.id);

});

app.get("*", async (req, res) => {
    //routes.home

    let desiredRoute: { route: string };
    let initialState: any;

    try {
        const found = Object.values(routes).filter(p => matchPath(req.path, { path: p.route, exact: true }))[0];
        const match = matchPath(req.path, { path: found.route });

        desiredRoute = { route: found.route };
        initialState = desiredRoute ? await found.getData(match ? (match.params as any).alias : null) : undefined;
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

        try {
            siteContent = renderToString(
                <Root.StaticRouter location={req.url} context={context}>
                    <Root.Root initialState={initialState} />
                </Root.StaticRouter>
            );
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
