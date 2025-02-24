import React from 'react';
import { Navbar, Nav, Message, useToaster } from 'rsuite';
import { SignOut } from '@phosphor-icons/react';
import { translations } from '../../i18n';
import * as security from '../../security';
import './styles.less';

interface Props {
    canLogOut: boolean;
}

export const NavBarInstance = (props: Props) => {
    const toaster = useToaster();

    const logOut = () => {
        security.logOut();
        toaster.push(
            <Message type="success">{translations.login.loggedOut}</Message>
        );
    };

    return (
        <Navbar className="top-bar" appearance="inverse">
            <Navbar.Header>
                <a href="#" className="navbar-brand logo">
                    Photographers Panel
                </a>
            </Navbar.Header>
            <Navbar.Body>
                <Nav pullRight>
                    {props.canLogOut && (
                        <Nav.Item onClick={logOut} icon={<SignOut size={16} />}>
                            {translations.login.logoutButton}
                        </Nav.Item>
                    )}
                </Nav>
            </Navbar.Body>
        </Navbar>
    );
};
