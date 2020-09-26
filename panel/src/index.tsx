import * as React from "react";
import { render } from "react-dom";
import { Root } from "./components/root/index";
import "./index.less";
import "rsuite/lib/styles/index.less";
import "chartist/dist/scss/chartist.scss";
import { BrowserRouter } from "react-router-dom";

render(
    <BrowserRouter basename="/panel">
        <Root />
    </BrowserRouter>,
    document.querySelector("#root")
);
