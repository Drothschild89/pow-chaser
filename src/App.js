import React, { Component, Fragment } from "react";
import "./App.css";
import User from "./components/User.js";
import PowNav from "./components/PowNav.js";
import { Switch, withRouter, Redirect } from "react-router-dom";
import Login from "./components/Login";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Favorites from "./components/Favorites.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Resort from "./components/Resort.js";

const API = "http://localhost:3000/";

class App extends Component {
  state = {
    user: {},
    error: false,
  };

  componentDidMount() {
    document.body.style.background = "skyblue";
    const token = localStorage.token;
    if (token) {
      this.persistUser(token);
    }
  }

  persistUser = (token) => {
    fetch(API + "/persist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.username) {
          const { username, id } = data;
          this.setState({
            user: {
              username,
              id,
            },
          });
        }
      });
  };

  handleAuthResponse = (data) => {
    console.log(data);
    if (data.user) {
      const { user, jwt } = data;

      this.setState({
        user: user,
        error: null,
      });

      localStorage.setItem("token", jwt);
      this.props.history.push("/user");
    } else if (data.error) {
      this.setState({
        error: data.error,
      });
    }
  };

  handleLogin = (e, userInfo) => {
    e.preventDefault();

    fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: userInfo }),
    })
      .then((resp) => resp.json())
      .then((data) => this.handleAuthResponse(data))
      .catch(console.log);
  };

  handleSignup = (e, userInfo) => {
    e.preventDefault();
    fetch(API + "/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: userInfo }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        this.handleAuthResponse(data);
      })
      .catch(console.log);
  };

  handleLogout = () => {
    localStorage.clear();
    this.setState({ user: {} });
  };

  // renderLoginPage = () => <Login handleLoginOrSignup={this.handleLogin} />;
  // renderSignUpPage = () => <Login handleLoginOrSignup={this.handleSignup} />;
  // renderHomePage = () => <Home username={this.state.user.username} />;

  render() {
    const { user, error } = this.state;
    return (
      <div className="App">
        <PowNav user={user} handleLogout={this.handleLogout} />
        <Route
          path="/login"
          render={(routerProps) => (
            <Login {...routerProps} handleLoginOrSignup={this.handleLogin} />
          )}
        />
        <Route
          path="/signup"
          render={(routerProps) => (
            <Login {...routerProps} handleLoginOrSignup={this.handleSignup} />
          )}
        />
        {!user.id && <Redirect to="/login" />}
        <Route
          path="/user"
          render={(routerProps) => (
            <User user={this.state.user} {...routerProps} />
          )}
        />
        <Route
          path="/favorites"
          render={(routerProps) => (
            <Favorites user={this.state.user} {...routerProps} />
          )}
        />
        <Route
          path="/resorts"
          render={(routerProps) => (
            <Resort user={this.state.user} {...routerProps} />
          )}
        />
      </div>
    );
  }
}

export default withRouter(App);
