import * as React from "react";
import {SemanticCOLORS, Menu as SemanticMenu, MenuItemProps} from "semantic-ui-react";
import {Link, withRouter} from "react-router-dom";

const colors: SemanticCOLORS[] = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black'];

const menuItems = [
    {route: '', icon: "home", text: 'Home'},
    {route: 'stats', icon: "signal", text: 'Stats'},
    {route: 'emails', icon: "mail outline", text: 'Emails'},
    {route: 'galleries', icon: "leaf", text: 'Galleries'},
    {route: 'blogs', icon: "flag", text: 'Blogs'},
    {route: 'comments', icon: "comments", text: 'Comments'},
    {route: 'logout', icon: "log out", text: 'Logout'}
];

interface Props{
    location: {
        pathname: string;
    }
}
interface State{}

class MenuComponent extends React.Component<Props, State> {

    state: { activeItem: string } = {activeItem: 'Home'};

    handleItemClick = (e: any, {name}: MenuItemProps) => this.setState({activeItem: name});

    render() {
        const activeItem = this.props.location.pathname.toLowerCase().substr(1);

        return <SemanticMenu style={{height: '100%', borderRadius: '0px'}} icon='labeled' size='tiny' vertical compact inverted>
            {menuItems.map((mi, id) => <SemanticMenu.Item
                style={{borderRadius:'0px'}}
                key={mi.text}
                as={Link}
                to={mi.route}
                name={mi.text}
                icon={mi.icon}
                color={colors[id]}
                active={activeItem === mi.route}
                onClick={this.handleItemClick}/>)}
        </SemanticMenu>
    }

}

export const Menu = withRouter(props => <MenuComponent {...props}/>);