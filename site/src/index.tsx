import * as React from "react";
import { render, hydrate } from "react-dom";
import { Root } from "./root";
import "./styles/slide.css";
import "./styles/style.css";
// import "./styles/styleSRA.css";
import "./styles/tablet.css";
import "./index.less";
import { BrowserRouter } from "react-router-dom";
import { StaticRouter } from "react-router";

if (typeof document !== 'undefined') {
    const initialState: any = (window as any).___InitialState___;
    delete (window as any).___InitialState___;

    hydrate(
        <BrowserRouter>
            <Root initialState={initialState} />
        </BrowserRouter>,
        document.querySelector("#root")
    );
} else {
    module.exports = {
        Root,
        StaticRouter
    };
}
