import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import Default from "./Default.png";
import DeleteUser from "./DeleteUser";
import ProfileTabs from './ProfileTabs';
import {listByUser} from '../post/apiPost';
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { },
      redirectToSignin: false,
      error: "",
      posts: []
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        listByUser(userId,token).then(res =>{
          this.setState({posts:res})
        })

        this.setState({ user: data.data });
      }
    });
  };
  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, posts,user } = this.state;
    if (redirectToSignin) return <Redirect to="/login" />;

    const photoUrl = user._id
        ? `/api/user/photo/${
            user._id
        }`
        : Default;

    return (
        <div className="container">
          <h2 className="mt-5 mb-5">Profile</h2>
          <div className="row">
            <div className="col-md-4">
              <img
                  style={{ height: "200px", width: "auto" }}
                  className="img-thumbnail"
                  src={photoUrl}
                  onError={i => (i.target.src = `${Default}`)}
                  alt={user.name}
              />
            </div>

            <div className="col-md-8">
              <div className="lead mt-2">
                <p>Full name :  {user.name}</p>
                <p>Email: {user.email}</p>
                <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
              </div>

              {isAuthenticated().user &&
              isAuthenticated().user._id === user._id ? (
                  <div className="d-inline-block">
                    <Link
                        className="btn btn-raised btn-info mr-5"
                        to={`/create/post`}
                    >
                      Create Suggestion
                    </Link>

                    <Link
                        className="btn btn-raised btn-success mr-5"
                        to={`/user/edit/${user._id}`}
                    >
                      Edit Profile
                    </Link>
                    <DeleteUser userId={user._id} />
                  </div>
              ) : (

                  <div>
                    <br />
                    <p>If you like my profile, please sign up my suggestions</p></div>
              )}
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col md-12 mt-5 mb-5">
              <hr />
              <p className="lead">{user.about}</p>
              <hr />
              <ProfileTabs
                  posts={posts}
              />
            </div>
          </div>
          <div>
            {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
                <div className="card mt-5">
                  <div className="card-body">
                    <h5 className="card-title">Admin</h5>
                    <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                    <Link
                        className="btn btn-raised btn-success mr-5"
                        to={`/user/edit/${user._id}`}
                    >
                      Edit Profile
                    </Link>
                    <DeleteUser userId={user._id} />
                  </div>
                </div>
            )}
          </div>
        </div>
    );
  }
}

export default Profile;