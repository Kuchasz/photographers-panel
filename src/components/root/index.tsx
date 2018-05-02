import * as React from "react";
import {Menu, MenuItemProps, Segment, Sidebar, SemanticCOLORS} from "semantic-ui-react";
import {Dashboard} from "../dashboard/index";

const colors: SemanticCOLORS[] = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black'];

const menuItems = [
    {icon: "home", text: 'Home'},
    {icon: "signal", text: 'Stats'},
    {icon: "mail outline", text: 'Emails'},
    {icon: "leaf", text: 'Galleries'},
    {icon: "flag", text: 'Blogs'},
    {icon: "comments", text: 'Comments'},
    {icon: "log out", text: 'Logout'}
];

export class Root extends React.Component {
    state: { activeItem: string } = {activeItem: 'Home'};

    handleItemClick = (e: any, {name}: MenuItemProps) => this.setState({activeItem: name});

    render() {
        const {activeItem} = this.state;

        return (
            <Sidebar.Pushable as={Segment}>
                <Sidebar as={Menu} animation='uncover' visible={true} icon='labeled' vertical
                         inverted>
                    {menuItems.map((mi, id) => <Menu.Item key={mi.text} name={mi.text} icon={mi.icon} color={colors[id]} active={activeItem === mi.text}
                                                    onClick={this.handleItemClick}></Menu.Item>)}
                </Sidebar>
                <Sidebar.Pusher>
                    <Segment basic>
                        <Dashboard/>
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}