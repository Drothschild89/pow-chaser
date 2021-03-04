import React from "react";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { Table } from "react-bootstrap";
// import Form from "react-bootstrap/Form";

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

  updateRating = (e, resort) => {
    // debugger;
    let favorite = {
      rating: e.target.value,
      resort_id: resort.resort.id,
      user_id: this.props.user.id,
    };
    fetch(`http://localhost:3000/favorites/` + e.target.id, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favorite }),
    })
      .then((res) => res.json())
      .then((favorite) => {
        // let newRating = favorite.rating === e.target.value;
        // favorite.rating = newRating;
        let newRating = this.state.favorites.map((f) =>
          f.id == favorite.id ? favorite : f
        );
        this.setState({
          favorites: newRating,
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
              <th>Edit Rating</th>
              <th>Remove From Favorites</th>
            </tr>
          </thead>
          <tbody>
            {this.state.favorites.map((resort) => (
              <tr>
                <td>{resort.resort.name}</td>
                <td>{resort.rating}</td>
                <td>
                  <form>
                    <label></label>
                    <select
                      name="option"
                      id={`${resort.id}`}
                      onChange={(e) => this.updateRating(e, resort)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </form>
                </td>
                <td>
                  <Button
                    variant="primary"
                    value={`${resort.id}`}
                    size="sm"
                    onClick={(e) => this.removeFromFavorites(e)}
                  >
                    Remove
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
