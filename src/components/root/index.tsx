import * as React from "react";
import {Route} from "react-router";
import {Segment, Sidebar} from "semantic-ui-react";
import {Dashboard} from "../dashboard/index";
import {Menu} from "../menu/index";
import {Galleries} from "../galleries/index";

export class Root extends React.Component {
    render() {
        return (
            <div>
                <Sidebar visible style={{width: 'auto'}}>
                    <Menu/>
                </Sidebar>
                <Sidebar.Pusher>
                    <Segment basic>
                        <Route exact path='/' component={Dashboard}/>
                        <Route exact path='/galleries' component={Galleries}/>
                    </Segment>
                </Sidebar.Pusher>
            </div>
        )
    }
}