import React from "react";
import Plot from "react-plotly.js";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "react-bootstrap";
import Favorites from "./Favorites.js";
import Card from "react-bootstrap/Card";
import Logo from "../img/powchaser.png";
import Resorts from "./Resort.js";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

class User extends React.Component {
  state = {
    snowChange: 0,
    date: 0,
    snowDepth: 0,
    mountain: "",
    latitude: 0,
    longitude: 0,
    elevation: 0,
    powChartXValues: [],
    powChartYValues: [],
    temperature: 0,
    favorites: [],
    resorts: [],
    visited: [],
    wishlist: [],
    us_state: "",
  };

  componentDidMount = () => {
    this.fetchMountains();
    this.getSquaw();
    this.fetchFavorites();
    this.getWishList();
  };

  getStates = () => {
    let us_states = [];
    this.state.resorts.forEach((resort) => {
      if (!us_states.includes(resort.us_state)) {
        us_states.push(resort.us_state);
      }
    });
    return us_states;
  };

  fetchFavorites = () => {
    fetch("http://localhost:3000/favorites")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          favorites: data,
        })
      );
  };

  fetchMountainData = (resort) => {
    let API_Call = `http://localhost:3000/pow`;
    let powChartXValuesFunction = [];
    let powChartYValuesFunction = [];
    fetch(API_Call, {
      method: "POST",
      headers: {
        "content-type": "Application/json",
      },
      body: JSON.stringify({ resort_id: resort.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.data.map((pow) => powChartXValuesFunction.push(pow.Date));
        data.data.map((pow) =>
          powChartYValuesFunction.push(parseInt(pow["Snow Depth (in)"]))
        );
        this.setState({
          powChartXValues: powChartXValuesFunction,
          powChartYValues: powChartYValuesFunction,
          date: data.data[30].Date,
          snowDepth: data.data[30]["Snow Depth (in)"],
          snowChange: data.data[30]["Change In Snow Depth (in)"],
          temperature:
            data.data[30]["Observed Air Temperature (degrees farenheit)"],
          elevation: data.station_information.elevation,
          mountain: data.station_information.name,
          latitude: data.station_information.location.lat,
          longitude: data.station_information.location.lng,
        });
      });
  };

  getSquaw = () => {
    let API_Call = "http://localhost:3000/squaw";
    let powChartXValuesFunction = [];
    let powChartYValuesFunction = [];
    fetch(API_Call)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data.data.data.map((pow) => powChartXValuesFunction.push(pow.Date));
        data.data.data.map((pow) =>
          powChartYValuesFunction.push(parseInt(pow["Snow Depth (in)"]))
        );
        this.setState({
          powChartXValues: powChartXValuesFunction,
          powChartYValues: powChartYValuesFunction,
          date: data.data.data[30].Date,
          snowDepth: data.data.data[30]["Snow Depth (in)"],
          snowChange: data.data.data[30]["Change In Snow Depth (in)"],
          temperature:
            data.data.data[30]["Observed Air Temperature (degrees farenheit)"],
          elevation: data.data.station_information.elevation,
          mountain: data.data.station_information.name,
          latitude: data.data.station_information.location.lat,
          longitude: data.data.station_information.location.lng,
        });
      });
  };

  handleFavorites = (resort) => {
    let token = localStorage.getItem("token");
    let data = {
      favorite: {
        rating: resort.rating,
        resort_id: resort.id,
        user_id: this.props.user.id,
      },
    };
    if (token) {
      fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((favorite) => {
          console.log(favorite);
        });
    }
  };

  fetchMountains = () => {
    fetch("http://localhost:3000/resorts")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          resorts: data,
        })
      );
  };

  addToWishList = (resort) => {
    let token = localStorage.getItem("token");
    let data = {
      rating: resort.rating,
      resort_id: resort.id,
      user_id: this.props.user.id,
    };
    if (token) {
      fetch("http://localhost:3000/wishlists", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((resort) => {
          if (!resort.error) {
            this.setState({
              wishlist: [...this.state.wishlist, resort],
            });
          }
        });
    }
  };

  getWishList = () => {
    let token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/wishlists", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((data) =>
          this.setState({
            wishlist: data,
          })
        );
    }
  };

  renderWishList = () => {
    if (this.state.wishlist.length > 0) {
      return this.state.wishlist.map((listing) => {
        return (
          <div className="wishlist">
            <Row>
              <Col>
                {" "}
                <Button
                  variant="primary"
                  value={`${listing.id}`}
                  onClick={() => this.fetchMountainData(listing.resort)}
                >
                  {listing.resort.name}
                </Button>{" "}
              </Col>
              <Col>
                {" "}
                <Button
                  value={`${listing.id}`}
                  onClick={(e) => this.deleteWishListItem(e)}
                >
                  Remove
                </Button>{" "}
                <br></br>
              </Col>{" "}
            </Row>
          </div>
        );
      });
    }
  };

  deleteWishListItem = (e) => {
    let token = localStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:3000/wishlists/` + e.target.value, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((wishlist) => {
          let newWishList = this.state.wishlist.filter(
            (w) => w.id !== wishlist.id
          );
          this.setState({
            wishlist: newWishList,
          });
        });
    }
  };

  setUsState = (s) => {
    this.setState({
      us_state: s,
    });
  };

  sortedResorts = () => {
    return this.state.resorts.sort((a, b) => (a.name < b.name ? -1 : 1));
  };

  render() {
    return (
      <div>
        <Container>
          <img src={Logo} className="order-img" />
          <br></br>
          <Navbar.Brand>
            <h1 className="title">
              {this.state.mountain} : {this.state.date}
            </h1>
          </Navbar.Brand>
          <br></br>
          <Navbar.Brand>Click a mountain below to find the pow</Navbar.Brand>
          <Row>
            <Col>
              <Plot
                data={[
                  {
                    x: this.state.powChartXValues,
                    y: this.state.powChartYValues,
                    type: "scatter",
                    fill: "tozeroy",
                    mode: "lines+markers",
                    marker: { color: "white", size: 2 },
                  },
                ]}
                layout={{
                  width: 700,
                  height: 450,
                  paper_bgcolor: "rgba(0,0,0,0)",
                  plot_bgcolor: "rgba(0,0,0,0)",
                  xaxis: {
                    showgrid: false,
                    visible: true,
                  },
                  yaxis: {
                    showgrid: false,
                    showline: true,
                  },
                }}
              />
            </Col>
            <Col>
              <br></br> <br></br> <br></br> <br></br>
              <Card className="cards" border="dark" bg="light" text="dark">
                <Card.Title className="mt-2">Today's Statistics:</Card.Title>
                <Card.Text>
                  Snow Depth: {this.state.snowDepth} inches{" "}
                </Card.Text>
                <Card.Text>
                  Daily change in powder levels: {this.state.snowChange}inches
                </Card.Text>
                <Card.Text>Temperature: {this.state.temperature}F</Card.Text>
                <Card.Text>Elevation: {this.state.elevation} feet</Card.Text>
                <Card.Text>Latitude: {this.state.latitude}</Card.Text>
                <Card.Text className="mb-2">
                  Longitude: {this.state.longitude}
                </Card.Text>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="cards" border="dark" bg="light" text="dark">
                <Card.Title className="mt-2">Choose State</Card.Title>
                <div>
                  <DropdownButton
                    id="dropdown-basic-button"
                    title="Pick A State"
                    className="state-pick"
                  >
                    {" "}
                    {this.getStates().map((s) => {
                      return (
                        <Dropdown.Item
                          onClick={() => this.setUsState(s)}
                          className="dropdown-item"
                          href="#"
                        >
                          {s}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
                {this.sortedResorts().map((resort) => {
                  if (resort.us_state === this.state.us_state)
                    return (
                      <div>
                        <Button
                          onClick={() => this.fetchMountainData(resort)}
                          variant="primary"
                        >
                          {resort.name}
                        </Button>{" "}
                        <Button
                          variant="primary"
                          onClick={() => this.handleFavorites(resort)}
                        >
                          Add To Favorites
                        </Button>{" "}
                        <Button
                          variant="primary"
                          onClick={() => this.addToWishList(resort)}
                        >
                          Wish List
                        </Button>{" "}
                        <br></br>
                        <br></br>
                      </div>
                    );
                })}
              </Card>
            </Col>
            <Col>
              <Card
                border="dark"
                bg="light"
                text="dark"
                style={{ width: "30rem" }}
                className="cards"
              >
                <Card.Title className="mt-2">Wish List</Card.Title>

                <Card.Text className="mb-2">{this.renderWishList()}</Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default User;
