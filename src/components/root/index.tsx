import * as React from "react";
import {Route} from "react-router";
import {Dashboard} from "../dashboard/index";
import {Menu} from "../menu/index";
import {Galleries} from "../galleries/index";

export class Root extends React.Component {
    render() {
        return (
            <div id="layout">
                <div>
                    <Menu/>
                </div>
                <div>
                    <Route exact path='/' component={Dashboard}/>
                    <Route exact path='/galleries' component={Galleries}/>
                </div>
            </div>
        )
    }
}