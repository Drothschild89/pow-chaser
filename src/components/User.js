import React from "react";
import Plot from "react-plotly.js";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import Favorites from "./Favorites.js";

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
    console.log(this.state.resorts);
  };

  fetchFavorites = () => {
    // let favorites = []
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
    let data = {
      favorite: {
        rating: resort.rating,
        resort_id: resort.id,
        user_id: this.props.user.id,
      },
    };
    console.log(data);
    fetch("http://localhost:3000/favorites", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((favorite) => {
        console.log(favorite);
      });
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
      wishlist: {
        rating: resort.rating,
        resort_id: resort.id,
        user_id: this.props.user.id,
      },
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
      .then((resort) =>
        this.setState({
          wishlist: resort,
        })
      );
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
    //   debugger
    if (this.state.wishlist.length > 0) {
      return this.state.wishlist.map((listing) => {
        return (
          <ul>
            <li>{listing.resort.name}</li>
            <li>{listing.rating}</li>
          </ul>
        );
      });
    }
  };

  render() {
    return (
      <div>
        <Container>
          <h1 className="title">
            {this.state.mountain} : {this.state.date}
          </h1>
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
              <div className="stats">
                <h3>Today's Statistics:</h3>
                <p>Snow Depth: {this.state.snowDepth} inches</p>
                <p>Change in powder levels: {this.state.snowChange} inches</p>
                <p>Elevation: {this.state.elevation} feet</p>
                <p>Latitude: {this.state.latitude}</p>
                <p>Longitude: {this.state.longitude}</p>
                <p>Temperature: {this.state.temperature}F</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="california">
                <h2>California Mountains</h2>
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
              </div>
            </Col>
            <Col>
              <div className="washington">
                <h2>Washington Mountains</h2>
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
                        <br></br>
                        <br></br>
                      </div>
                    );
                })}
              </div>
            </Col>
            <Col>
              <div className="visited">
                <p>Wish List</p>
                {this.renderWishList()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default User;
