import React from "react";
import express from "express";
import {randomElement} from "utils/array";
import {renderToString} from "react-dom/server";

import Home from "../site/src/areas/home";

const elements = [1,2,3,4,5,6,7,8,9];

const app = express();

app.use(express.static("../site"));

app.get('/', (_req, res) => {
    res.send(`<strong>Control <i>smile:</i> ${randomElement(elements)}</strong>`);
});

app.get('/home', (req,res) => {
    res.send(renderToString(<Home/>));
});

app.listen(8080, () => {
    console.log("Photographers-panel server started");
});