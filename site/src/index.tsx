import * as React from "react";
import * as ReactDOM from "react-dom";
import {Root} from "./root";
import "./styles/slide.css";
import "./styles/style.css";
// import "./styles/styleSRA.css";
import "./styles/tablet.css";
import "./index.less";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
    <BrowserRouter forceRefresh={true}>
        <Root/>
    </BrowserRouter>,
    document.querySelector("#root"));