import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Button, Form, LinkContainer } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

const Navbar = ({ user, handleLogout }) => {
  return (
    <header>
      <h3>Pow Chaser - The pow is calling, and I must go</h3>
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
              <NavLink to="/login" exact>
                Home
              </NavLink>
            </li>
        
            <li>
                <NavLink to='/login' onClick={handleLogout}>
                    Logout
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Navbar;