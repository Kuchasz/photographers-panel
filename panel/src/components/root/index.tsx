import * as React from "react";
import {Route} from "react-router";
import {Dashboard} from "../dashboard/index";
import {Menu} from "../menu/index";
import {Galleries} from "../galleries/index";
import { NavBarInstance } from "../navbar";
import { Emails } from "../emails";

export class Root extends React.Component {
    render() {
        return (
            <div style={{height: '100%', display:'flex', flexDirection:'column'}}>
                <NavBarInstance/>
                <div id="layout">
                    <div>
                        <Menu/>
                    </div>
                    <div id="content">
                        <Route exact path='/' component={Dashboard}/>
                        <Route exact path='/galleries' component={Galleries}/>
                        <Route exact path='/emails' component={Emails}/>
                    </div>
                </div>
            </div>
        )
    }
}