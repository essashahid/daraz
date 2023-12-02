import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

export const AppLayout = ({ children }) => {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/home">Daraz</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav className="ms-auto">
              <Navbar.Text>
                Signed in as: {userName} ({userEmail})
              </Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-3">{children}</div>
    </>
  );
};

export default AppLayout;
