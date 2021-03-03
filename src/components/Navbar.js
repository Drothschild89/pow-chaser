import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Button, Form} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import {Nav} from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";

const Navbar = ({ user, handleLogout }) => {
  return (
    <Nav style={{ backgroundColor: "#212833" }}>
        <Col>
    <header>
      <h3 style={{ color: "#C0C0C0" }}>Pow Chaser - The pow is calling, and I must go</h3>
      <ul>
        {!user.id ? (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Sign up</NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
            <Button variant="secondary" >
              <NavLink style={{ color: "#C0C0C0" }} to="/user" exact>
                Home
              </NavLink>
              </Button>
            </li><br></br>
            <li>
            <Button variant="secondary" >
            <NavLink style={{ color: "#C0C0C0" }} to="/favorites" exact>
                Favorites
              </NavLink>
              </Button>
            </li> <br></br>
            <li>
            <Button  class="btn btn-primary mx-auto d-block" variant="secondary" >
                <NavLink style={{ color: "#C0C0C0" }} to='/login' onClick={handleLogout}>
                    Logout
              </NavLink>
              </Button>
            </li>
          
          </>
        )}
      </ul>
    </header>
    </Col>
    </Nav>
  );
};

export default Navbar;