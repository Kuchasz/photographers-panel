import React from "react";
import { Navbar, Nav, Icon } from "rsuite";

export const NavBarInstance = () => {
    return (
      <Navbar appearance="inverse">
        <Navbar.Header>
          <a href="#" className="navbar-brand logo">
            PP
          </a>
        </Navbar.Header>
        <Navbar.Body>
          <Nav pullRight>
            <Nav.Item icon={<Icon icon="power-off" />}>Logout</Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
    );
  };