import React from "react";

class User extends React.Component {

    componentDidMount = () => {
        fetch('http://localhost:3000/pow')
        .then(res => res.json())
        .then(data => console.log(data.data.data))
    }

    render() {
        return (
            <h1>Test</h1>
        )
    }
}

export default User
