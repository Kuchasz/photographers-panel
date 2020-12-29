import * as React from "react";
import { Sidenav, Nav, Icon } from "rsuite";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { routes } from "../../routes";
import { translations } from "../../i18n";
import { ImagesUploader } from "../images-uploader";
import "./styles.less";
interface MenuItem {
    icon: any;
    route: string;
    text: string;
}

const menuItems: MenuItem[] = [
    { route: routes.home, icon: "home", text: translations.menu.home },
    { route: routes.stats, icon: "signal", text: translations.menu.stats },
    // { route: routes.emails, icon: "envelope-o", text: 'Emails' },
    { route: routes.galleries, icon: "leaf", text: translations.menu.galleries },
    { route: routes.blogs, icon: "flag", text: translations.menu.blogs },
    { route: routes.comments, icon: "comments", text: translations.menu.comments },
    // { route: routes.login, icon: "trash", text: 'LogIn' }
];

interface Props extends RouteComponentProps {

}

interface State {

}


class MenuComponent extends React.Component<Props, State> {

    handleItemClick = (route: string) => { this.props.history.push(route); }

    render() {
        const activeItem = this.props.location.pathname.toLowerCase();

        return <div className="side-menu">
            <Sidenav style={{ height: '100%' }} onSelect={this.handleItemClick} activeKey={activeItem} expanded={false}>
                <Sidenav.Body>
                    <Nav>
                        {menuItems.map((mi, id) => <Nav.Item key={id} eventKey={mi.route} active={activeItem === mi.route} icon={<Icon icon={mi.icon} />}>{mi.text}
                        </Nav.Item>)}
                    </Nav>
                    <Nav>
                        {/* {<Nav.Item icon={<Icon icon="arrow-circle-o-up" />}>Transfers</Nav.Item>} */}
                        <ImagesUploader />
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    }
}

export const Menu = withRouter(props => <MenuComponent {...props} />);