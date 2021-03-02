import React from 'react' 
import { Container, Row, Col, Button, Form, Alert} from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

class Favorites extends React.Component {

    state={
        favorites: []
    }

    componentDidMount = () => {
        fetch('http://localhost:3000/favorites')
        .then(res => res.json())
        .then(data => this.setState({
            favorites: data
        }))
    }
  
    // data[0].resort.rating
    render(){
        return(
            <Container>
                <div className="o-d-top">
                    <Row>
                        <Col>
                        <p className="favorite-p"> Resort </p>
                        </Col>
                        <Col>
                        <p className="favorite-p"> Rating </p>
                        </Col>
                    </Row>
                </div>
            <div className="o-d">
                <Row>
                    <Col>
                <p>{this.state.favorites.map(favorite => favorite.resort.name)}</p>
                </Col>
                <Col>
                <p>{' '}{this.state.favorites.map(favorite => favorite.resort.rating)}{' '}</p>
                </Col>
                </Row>
            </div>
            </Container>
        )
    }
}

export default Favorites