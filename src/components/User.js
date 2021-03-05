import React from "react";
import Plot from "react-plotly.js";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import Favorites from "./Favorites.js";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Logo from "../img/powchaser.png";

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
  };

  componentDidMount = () => {
    this.fetchMountains();
    this.getAlpine();
    this.fetchFavorites();
    this.getWishList();
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
    let mountain = resort.name.split(" ")[0].toLowerCase();
    // let mountain = resort.name.split(' ').join('-')
    let API_Call = `http://localhost:3000/${mountain}`;
    let powChartXValuesFunction = [];
    let powChartYValuesFunction = [];
    fetch(API_Call)
      .then((res) => res.json())
      .then((data) => {
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

  getAlpine = () => {
    let API_Call = "http://localhost:3000/alpine";
    let powChartXValuesFunction = [];
    let powChartYValuesFunction = [];
    fetch(API_Call)
      .then((res) => res.json())
      .then((data) => {
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
    let data = {
      rating: resort.rating,
      resort_id: resort.id,
      user_id: this.props.user.id,
    };
    fetch("http://localhost:3000/wishlists", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
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
  };

  getWishList = () => {
    fetch("http://localhost:3000/wishlists")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          wishlist: data,
        })
      );
  };

  renderWishList = () => {
    if (this.state.wishlist.length > 0) {
      return this.state.wishlist.map((listing) => {
        return (
          <Row>
            <Col>
              <p>{listing.resort.name}</p>
            </Col>
            <Col>
              <p>{Math.floor(listing.rating)}</p>
            </Col>
            <Col>
              <Button
                value={`${listing.id}`}
                onClick={(e) => this.deleteWishListItem(e)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        );
      });
    }
  };

  deleteWishListItem = (e) => {
    fetch(`http://localhost:3000/wishlists/` + e.target.value, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
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
              <Card border="dark" bg="light" text="dark">
                <Card.Title>Today's Statistics:</Card.Title>
                <Card.Text>
                  Snow Depth: {this.state.snowDepth} inches{" "}
                </Card.Text>
                <Card.Text>
                  Daily change in powder levels: {this.state.snowChange}inches
                </Card.Text>
                <Card.Text>Temperature: {this.state.temperature}F</Card.Text>
                <Card.Text>Elevation: {this.state.elevation} feet</Card.Text>
                <Card.Text>Latitude: {this.state.latitude}</Card.Text>
                <Card.Text>Longitude: {this.state.longitude}</Card.Text>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card bg="dark" border="secondary" text="light">
                <Card.Title>California Mountains</Card.Title>
                {this.state.resorts.map((resort) => {
                  if (resort.us_state === "CA")
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
              <Card bg="dark" border="secondary" text="light">
                <Card.Title>Washington Mountains</Card.Title>
                {this.state.resorts.map((resort) => {
                  if (resort.us_state === "WA")
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
          </Row>
          <br></br> <br></br> <br></br>
          <Row>
            <Col>
              <Card
                border="dark"
                bg="light"
                text="dark"
                style={{ width: "30rem" }}
              >
                <Card.Body>
                  <Card.Title>Wish List</Card.Title>
                  <Card.Text>{this.renderWishList()}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default User;
