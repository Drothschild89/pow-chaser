import React from "react";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { Table } from "react-bootstrap";

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
        <Table>
          <thead>
            <tr>
              <th>Resort</th>
              <th>Rating</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.favorites.map((resort) => (
              <tr>
                <td>{resort.resort.name}</td>
                <td>{resort.resort.rating}</td>
                <td>
                  <Button
                    variant="primary"
                    value={`${resort.id}`}
                    size="sm"
                    onClick={(e) => this.removeFromFavorites(e)}
                  >
                    Remove From Favorites
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default Favorites;
