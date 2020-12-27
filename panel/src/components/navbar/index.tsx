import React from "react";
import { Navbar, Nav, Icon, Alert } from "rsuite";
import { translations } from "../../i18n";
import * as security from "../../security";
import { ImagesUploader } from "../images-uploader";
import "./styles.less";

interface Props {
  canLogOut: boolean;
}

export const NavBarInstance = (props: Props) => {

  const logOut = () => {
    security.logOut();
    Alert.success(translations.login.loggedOut);
  }

  return (
    <Navbar className="top-bar" appearance="inverse">
      <Navbar.Header>
        <a href="#" className="navbar-brand logo">
          Photographers Panel
          </a>
      </Navbar.Header>
      <Navbar.Body>
        <Nav pullRight>
          <ImagesUploader/>
          {props.canLogOut && <Nav.Item onClick={logOut} icon={<Icon icon="power-off" />}>{translations.login.logoutButton}</Nav.Item>}
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};