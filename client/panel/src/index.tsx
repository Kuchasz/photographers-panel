import * as React from "react";
import * as ReactDOM from "react-dom";
import {Root} from "./components/root/index";
import "./index.less";
import 'rsuite/lib/styles/index.less';
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
    <BrowserRouter>
        <Root/>
    </BrowserRouter>,
    document.querySelector("#root"));
