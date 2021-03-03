import React from "react";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

class Favorites extends React.Component {
  state = {
    favorites: [],
  };

  componentDidMount = () => {
    fetch("http://localhost:3000/favorites")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          favorites: data,
        })
      );
  };

  removeFromFavorites = (e) => {
    fetch(`http://localhost:3000/favorites/` + e.target.value, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((favorite) => {
        let newFavorites = this.state.favorites.filter(
          (f) => f.id !== favorite.id
        );
        this.setState({
          favorites: newFavorites,
        });
      });
  };

  render() {
    return (
      <Container>
        <div className="favorites-container">
          <div className="o-d-top">
            <Row>
              <Col xs={6}>
                <p className="favorite-p"> Resort </p>
              </Col>
              <Col xs={6}>
                <p className="favorite-p"> Rating </p>
              </Col>
            </Row>
          </div>
          <Row>
            <Col xs={6}>
              {this.state.favorites.map((resort) => (
                <Row className="favorite-row">
                  <p>{resort.resort.name}</p>
                </Row>
              ))}
            </Col>
            <Col xs={6}>
              {this.state.favorites.map((resort) => (
                <Row>
                  <p>
                    {resort.resort.rating} {""}{" "}
                    <Button
                      variant="primary"
                      value={`${resort.id}`}
                      size="sm"
                      onClick={(e) => this.removeFromFavorites(e)}
                    >
                      Remove From Favorites
                    </Button>
                  </p>
                </Row>
              ))}
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

export default Favorites;
