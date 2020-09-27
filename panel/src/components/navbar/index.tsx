import React from "react";
import { Navbar, Nav, Icon, Alert } from "rsuite";
import * as security from "../../security";


interface Props {
  canLogOut: boolean;
}

export const NavBarInstance = (props: Props) => {

  const logOut = () => {
    security.logOut();
    Alert.success("Successfully logged-out!");
  }

  return (
    <Navbar appearance="inverse">
      <Navbar.Header>
        <a href="#" className="navbar-brand logo">
          PP
          </a>
      </Navbar.Header>
      <Navbar.Body>
        <Nav pullRight>
          {props.canLogOut && <Nav.Item onClick={logOut} icon={<Icon icon="power-off" />}>Logout</Nav.Item>}
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};