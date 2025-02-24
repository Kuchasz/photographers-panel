import { ChartLine, Cloud, House, Image, MessengerLogo } from '@phosphor-icons/react';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Nav, Sidenav } from 'rsuite';
import { translations } from '../../i18n';
import { routes } from '../../routes';
import { ImagesUploader } from '../images-uploader';
import './styles.less';
interface MenuItem {
    icon: any;
    route: string;
    text: string;
}

const menuItems: MenuItem[] = [
    { route: routes.home, icon: <House size={16} />, text: translations.menu.home },
    { route: routes.stats, icon: <ChartLine size={16} />, text: translations.menu.stats },
    // { route: routes.emails, icon: "envelope-o", text: 'Emails' },
    { route: routes.galleries, icon: <Image size={16} />, text: translations.menu.galleries },
    { route: routes.blog.list, icon: <Cloud size={16} />, text: translations.menu.blogs },
    {
        route: routes.comments,
        icon: <MessengerLogo size={16} />,
        text: translations.menu.comments,
    },
    // { route: routes.login, icon: "trash", text: 'LogIn' }
];

export const Menu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const activeItem = location.pathname.toLowerCase();

    const handleItemClick = (eventKey: string | undefined) => {
        if (eventKey) {
            navigate(eventKey);
        }
    };

    return (
        <div className="side-menu">
            <Sidenav
                style={{ height: '100%' }}
                expanded={false}>
                <Sidenav.Body>
                    <Nav onSelect={handleItemClick} activeKey={activeItem}>
                        {menuItems.map((mi, id) => (
                            <Nav.Item
                                key={id}
                                eventKey={mi.route}
                                active={activeItem === mi.route}
                                icon={mi.icon}>
                                {mi.text}
                            </Nav.Item>
                        ))}
                    </Nav>
                    <Nav>
                        {/* {<Nav.Item icon={<Icon icon="arrow-circle-o-up" />}>Transfers</Nav.Item>} */}
                        <ImagesUploader />
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    );
};
