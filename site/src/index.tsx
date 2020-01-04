import * as React from "react";
import { render, hydrate } from "react-dom";
import { Root } from "./root";
import "./styles/slide.css";
import "./styles/style.css";
import "./styles/tablet.css";
import "./styles/mobile.css";
import "./index.less";
import { BrowserRouter } from "react-router-dom";
import { StaticRouter } from "react-router";
import {renderToString} from "react-dom/server";

if (typeof document !== 'undefined') {
    let initialState: any = (window as any).___InitialState___;
    delete (window as any).___InitialState___;

    hydrate(
        <BrowserRouter>
            <Root initialState={initialState} />
        </BrowserRouter>,
        document.querySelector("#root")
    );

    for (var prop in initialState) delete initialState[prop];

    initialState = undefined;
} else {
    module.exports = {
        Root,
        createElement: React.createElement,
        StaticRouter,
        renderToString
    };
}
