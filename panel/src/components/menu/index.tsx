import * as React from "react";
import { Sidenav, Nav, Icon, Whisper, Popover, Progress } from "rsuite";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { routes } from "../../routes";
import { translations } from "../../i18n";
import { ImagesUploader } from "../images-uploader";
import "./styles.less";
import { UploadedImage, useUploadedImages } from "../../state/uploaded-images";
import { all } from "@pp/utils/array";
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

const Speaker = ({ content, ...props }: any) => {
    const uploadedImages = useUploadedImages(x => x.images);
    const imagesByBatches: {[key: string]: UploadedImage[]} = uploadedImages.reduce((acc: any, cur) => ({...acc, [cur.batchId]: [...(acc[cur.batchId] || []), cur]}), {});

    const proper = Object.values(imagesByBatches).filter(images => !all(images, img => img.processed)).reduce((acc, cur) => [...acc, ...cur], []);

    // console.log(proper);

    return (
        <Popover title="Uploads" {...props}>
            {proper.map(ui => <div key={ui.originId}>{ui.name} - {ui.size} <Progress.Circle showInfo={false} style={{ width: 20, display: "inline-block" }} percent={ui.progress} /></div>)}
        </Popover>
    );
};

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
                        {<Whisper trigger="click" placement="rightEnd" speaker={<Speaker content={`I am positioned to the auto`} />}>
                            {<Nav.Item icon={<Icon icon="arrow-circle-o-up" />}><ImagesUploader /></Nav.Item>}
                        </Whisper>}
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    }
}

export const Menu = withRouter(props => <MenuComponent {...props} />);