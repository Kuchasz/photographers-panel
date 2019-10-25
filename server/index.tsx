import React from "react";
import express from "express";
import { randomElement } from "../utils/array";
import { renderToString } from "react-dom/server";
import { matchPath, StaticRouter } from "react-router";
import { getMostRecent } from "./src/models/blog";
import Root from "../site/dist/bundle.js";
import * as getLastBlog from "../api/get-last-blog";
import * as getBlogsList from "../api/get-blogs-list";
import fs from "fs";
import path from "path";
import {routes} from "../site/src/routes";
require("isomorphic-fetch");
const Youch = require('youch');


// import Home from "../site/src/areas/home";

const app = express();

app.use(express.static("../site/dist", {index: false}));

app.get(getLastBlog.route, async (_req, res) => {
  const blog = await getMostRecent();
  res.json(blog);
});

app.get(ge)

app.get("*", async (req, res) => {
  
  //routes.home

  const desiredRoute = Object.values(routes).filter(p => p.route === req.path)[0];//

  const initialState = desiredRoute ? await desiredRoute.getData() : undefined;

  fs.readFile(path.resolve("../site/dist/index.html"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred");
    }

    let siteContent = "";
    const context = {};

    try{
      siteContent = renderToString(
        <Root.StaticRouter location={req.url} context={context}>
          <Root.Root initialState={initialState} />
        </Root.StaticRouter>
      )
    } catch (err){
      const youch = new Youch(err, req);

      youch
      .toHTML()
      .then((html: string) => {
        res.writeHead(200, {'content-type': 'text/html'})
        res.write(html)
        res.end()
      })

      return;
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${siteContent}</div>`
      ).replace('{initial_state}',  `<script type="text/javascript">window.___InitialState___=${JSON.stringify(initialState)}</script>`)
    );
  });
});

app.listen(8080, () => {
  console.log("Photographers-panel server started");
});
