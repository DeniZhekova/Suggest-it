import React, { Component } from "react";
import Allpost from "../post/Allpost";
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
                    <h2 className="admin-dashboard">Admin Dashboard</h2>
                    <p className="welcome">Welcome to the Admin Dashboard of Suggest-it</p>
                    <p className="descr">This page can only be accessed by administrators.</p>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>Suggestions</h2>
                            <hr/>
                            <Allpost />
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