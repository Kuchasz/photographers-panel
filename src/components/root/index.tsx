import * as React from "react";
import {Segment, Sidebar} from "semantic-ui-react";
import {Dashboard} from "../dashboard/index";
import {Menu} from "../menu/index";
import {Route} from "react-router";
import {Galleries} from "../galleries/index";

export class Root extends React.Component {
    render() {
        return (
            <Sidebar.Pushable as={Segment}>
                <Sidebar as={Menu} animation='uncover' visible={true} icon='labeled' vertical
                         inverted/>
                <Sidebar.Pusher>
                    <Segment basic>
                        <Route exact path='/' component={Dashboard}/>
                        <Route exact path='/galleries' component={Galleries}/>
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}