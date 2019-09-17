import * as React from "react";
import {Sidenav, Nav, Icon} from "rsuite";
import {withRouter, RouteComponentProps} from "react-router-dom";

interface MenuItem{
    icon: any;
    route: string;
    text: string;
}

const menuItems: MenuItem[] = [
    {route: '', icon: "home", text: 'Home'},
    {route: 'stats', icon: "signal", text: 'Stats'},
    {route: 'emails', icon: "envelope-o", text: 'Emails'},
    {route: 'galleries', icon: "leaf", text: 'Galleries'},
    {route: 'blogs', icon: "flag", text: 'Blogs'},
    {route: 'comments', icon: "comments", text: 'Comments'}
];

const styles = {
    width: 150,
    display: 'inline-table',
    marginRight: 10,
    height: '100%'
  };

interface Props extends RouteComponentProps{

}

interface State{

}


class MenuComponent extends React.Component<Props, State> {

    handleItemClick = (route: string) => {this.props.history.push(route);}

    render() {
        const activeItem = this.props.location.pathname.toLowerCase().substr(1);

        return <div style={styles}>
            <Sidenav style={{height:'100%'}} onSelect={this.handleItemClick} activeKey={activeItem}>
            <Sidenav.Body>
                <Nav>
                    {menuItems.map((mi,id) => <Nav.Item key={id} eventKey={mi.route} active={activeItem === mi.route} icon={<Icon icon={mi.icon}/>}>{mi.text}
                            </Nav.Item>)}
                </Nav>
            </Sidenav.Body>
            </Sidenav>
        </div>
    }
}

export const Menu = withRouter(props => <MenuComponent {...props}/>);