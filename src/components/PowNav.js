import React from "react";
import { Container, Row, Col, Button, Form, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const PowNav = ({ user, handleLogout }) => {
  return (
    <Navbar bg="light">
      <LinkContainer to="/user">
        <Navbar.Brand>PowChaser</Navbar.Brand>
      </LinkContainer>

      <Nav className="mr-auto">
        {!user.id ? (
          <>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
              <Nav.Link>Sign up</Nav.Link>
            </LinkContainer>
          </>
        ) : (
          <>
            <LinkContainer to="/user">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/favorites">
              <Nav.Link>Favorites</Nav.Link>
            </LinkContainer>

            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </>
        )}{" "}
      </Nav>
      <Navbar.Brand>The Pow is calling, and I must go</Navbar.Brand>
    </Navbar>
  );
};

export default PowNav;
