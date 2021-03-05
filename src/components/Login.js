import React from "react";
import { Container, Row, Col, Button, Form, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../img/powchaser.png";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div className="Login">
        <img src={Logo} className="order-img" />
        <br></br>
        <br></br>
        <Navbar.Brand>Welcome to the shred shed</Navbar.Brand>
        <br></br> <br></br>
        <form onSubmit={(e) => this.props.handleLoginOrSignup(e, this.state)}>
          <label>Username: </label>
          {""}
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <br />
          <label>Password: </label>{" "}
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Login;
