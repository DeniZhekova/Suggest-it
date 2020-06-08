import React, { Component } from "react";
import SuggestionsList from "../suggest/SuggestionsList";
import User from "../user/User";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";

class Admin extends Component {
    state = {
        redirectToHome: false
    };
    
    // then on componentDidMount()
    componentDidMount() {
        if (isAuthenticated().user.role !== "admin") {
            this.setState({ redirectToHome: true });
        }
    }
    render() {
        if (this.state.redirectToHome) {
            return <Redirect to="/" />;
        }
        return (
            <div>
                <div className="jumbotron">
                    <h2>Admin Dashboard</h2>
                    <p className="lead">Welcome to the Admin Dashboard of Suggest-it</p>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>Suggestions</h2>
                            <hr/>
                            <SuggestionsList />
                        </div>
                        <div className="col-md-6">
                            <h2>Users</h2>
                            <hr/>
                            <User/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;