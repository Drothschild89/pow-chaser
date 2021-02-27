import React from "react";

class User extends React.Component {
    state={
        snowChange: 0,
        date: 0,
        snowDepth: 0,
        mountain: '',
        latitude: 0,
        longitude: 0,
        elevation: 0
    }

    componentDidMount = () => {
        fetch('http://localhost:3000/pow')
        .then(res => res.json())
        .then(data =>     this.setState({
            date: data.data.data[30].Date,
            snowDepth: data.data.data[30]["Snow Depth (in)"],
            snowChange: data.data.data[30]["Change In Snow Depth (in)"],
                temperature: data.data.data[30]["Observed Air Temperature (degrees farenheit)"],
                elevation: data.data.station_information.elevation,
                mountain: data.data.station_information.name,
                latitude: data.data.station_information.location.lat,
                longitude: data.data.station_information.location.lng
        }))
    }
    render() {
        return (
            <div>
            <h1>{this.state.mountain} : {this.state.date}</h1>
            <h3>Today's Snow Depth: {this.state.snowDepth} inches</h3>
            <h3>Today's change in powder levels: {this.state.snowChange} inches</h3>
            <h3>Elevation: {this.state.elevation} feet</h3>
            <h3>Latitude: {this.state.latitude}</h3>
            <h3>Latitude: {this.state.longitude}</h3>
            <h3>Temperature: {this.state.temperature}</h3>
            </div>
        )
    }
}

export default User
