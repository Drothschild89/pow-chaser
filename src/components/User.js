import React from "react";
import Plot from 'react-plotly.js';
import { Container, Row, Col, Button, Form, Alert} from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
class User extends React.Component {
    state={
        snowChange: 0,
        date: 0,
        snowDepth: 0,
        mountain: '',
        latitude: 0,
        longitude: 0,
        elevation: 0,
        powChartXValues: [],
        powChartYValues: [],
    }

    componentDidMount = () => {
        this.fetchPow()
        fetch('http://localhost:3000/pow')
        .then(res => res.json())
        .then(data =>  this.setState({
            date: data.data.data[30].Date,
            snowDepth: data.data.data[30]["Snow Depth (in)"],
            snowChange: data.data.data[30]["Change In Snow Depth (in)"],
            temperature: data.data.data[30]["Observed Air Temperature (degrees farenheit)"],
            elevation: data.data.station_information.elevation,
            mountain: data.data.station_information.name,
            latitude: data.data.station_information.location.lat,
            longitude: data.data.station_information.location.lng,
        }))
    }

    fetchPow = () => {
        let API_Call = 'http://localhost:3000/pow';
        let powChartXValuesFunction = [];
        let powChartYValuesFunction = [];
        fetch(API_Call)
        .then(res => res.json())
        .then( data => {
            data.data.data.map(pow => powChartXValuesFunction.push(pow.Date))
            data.data.data.map(pow => powChartYValuesFunction.push(parseInt(pow["Snow Depth (in)"])))
            this.setState({
                powChartXValues: powChartXValuesFunction,
                powChartYValues: powChartYValuesFunction
            })
        }
        )
    }

    test = () => {
        console.log('poop')
    }



    render() {
        return (
            <div>
                <Container>
            <h1 className="title">{this.state.mountain} : {this.state.date}</h1>
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
                    <br></br>         <br></br>         <br></br>         <br></br>
                    <div className="stats">  
                        <h3 >Today's Statistics</h3>
            <p>Snow Depth: {this.state.snowDepth} inches</p>
            <p>Change in powder levels: {this.state.snowChange} inches</p>
            <p>Elevation: {this.state.elevation} feet</p>
            <p>Latitude: {this.state.latitude}</p>
            <p>Latitude: {this.state.longitude}</p>
            <p>Temperature: {this.state.temperature}F</p>
            </div>
            </Col>
                    </Row>
                    <Row>
                        <Col>
                        <div className="california">
                        <h2>California Mountains</h2>
                        <Button onClick={this.test} variant="primary">Poop</Button>{' '}
                        </div>
                        </Col>
                        <Col>
                        <div className="washington">
                        <h2>Washington Mountains</h2>
                        </div>
                        </Col>
                    </Row>
                    </Container>
            </div>
        )
    }
}

export default User
