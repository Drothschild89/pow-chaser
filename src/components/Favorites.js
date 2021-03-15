import React from "react";
import { Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";

class Favorites extends React.Component {
  state = {
    favorites: [],
    notes: "",
    noteInput: "",
  };

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/favorites", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((data) =>
          this.setState({
            favorites: data,
          })
        );
    }
  };

  removeFromFavorites = (e) => {
    let token = localStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:3000/favorites/` + e.target.value, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
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
    }
  };

  updateRating = (e, resort) => {
    let token = localStorage.getItem("token");
    let favorite = {
      rating: e.target.value,
      resort_id: resort.resort.id,
      user_id: this.props.user.id,
    };
    if (token) {
      fetch(`http://localhost:3000/favorites/` + e.target.id, {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ favorite }),
      })
        .then((res) => res.json())
        .then((favorite) => {
          let newRating = this.state.favorites.map((f) =>
            f.id == favorite.id ? favorite : f
          );
          this.setState({
            favorites: newRating,
          });
        });
    }
  };

  addNote = (e, resort) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    let favorite = {
      note: this.state.noteInput,
      resort_id: resort.resort.id,
      user_id: this.props.user.id,
    };
    if (token) {
      fetch(`http://localhost:3000/favorites/` + resort.id, {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ favorite }),
      })
        .then((res) => res.json())
        .then((favorite) => {
          let newNote = this.state.favorites.map((n) =>
            n.id == favorite.id ? favorite : n
          );
          this.setState({
            favorites: newNote,
          });
        })
        .then(e.target.reset());
    }
  };

  handleNoteChange = (e) => {
    this.setState({
      noteInput: e.target.value,
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
              <th>Notes</th>
              <th>Leave a Note</th>
            </tr>
          </thead>
          <tbody>
            {this.state.favorites.map((resort) => (
              <tr>
                <td>{resort.resort.name}</td>
                <td>{Math.floor(resort.rating)}</td>
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
                <td>{resort.note}</td>
                <td>
                  <form onSubmit={(e) => this.addNote(e, resort)}>
                    <label>Note:</label>
                    <input
                      type="text"
                      onChange={(e) => this.handleNoteChange(e)}
                      id={`${resort.id}`}
                    ></input>
                    <input type="submit" value="Save Note" />
                  </form>
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
