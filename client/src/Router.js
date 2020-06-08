import React from "react";
import { Route,Switch } from "react-router-dom";
import Home from './core/Home';
import Navbar from './core/NavBar';
import Signup from './user/Signup';
import Profile from './user/Profile';
import Login from './user/Login';
import User from './user/User';
import EditProfile from './user/EditProfile';
import Findpeople from './user/Findpeople';
import Suggest from './suggest/Suggest';
import PrivateRoute from  './auth/PrivateRoute';
import SingleSuggestion from './suggest/SingleSuggestion';
import EditSuggestion from './suggest/EditSuggestion';
import ForgotPassword from "./user/ForgetPassword";
import ResetPassword from "./user/ResetPassword";
import Admin from './admin/Admin'
import StickyFooter from 'react-sticky-footer';

const NoMatchPage = () => {
  return (
    <div id="main">
    	<div className="fof">
        		<h1>Error 404</h1>
    	</div>
</div>
  );
};
const Router = () => (
  
  // eslint-disable-next-line no-unused-expressions
  <div>
    <Navbar/>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signup" exact component={Signup} />
      <Route path="/suggest/:suggestId" exact component={SingleSuggestion} />
      <PrivateRoute exact path="/admin" component={Admin} />
      <PrivateRoute path="/user/:userId" exact component={Profile} />
      <PrivateRoute path="/suggest/edit/:suggestId" exact component={EditSuggestion} />
      <PrivateRoute path="/user/edit/:userId" exact component={EditProfile} />
      <PrivateRoute path="/findpeople" exact component={Findpeople} />
      <PrivateRoute path="/create/suggest" exact component={Suggest} />
      <Route path="/login" exact component={Login} />
      <Route path="/users" exact component={User} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />
      <Route component={NoMatchPage} />
    </Switch>
    <StickyFooter className='jumbrotron'
    bottomThreshold={50}
    normalStyles={{
    backgroundColor: "#0E2F56",
    padding: "2rem",
    color:'white',
    textAlign:'center'
    }}
    stickyStyles={{
    backgroundColor: "rgba(14, 47, 86,.8)",
    padding: "2rem"
    }}
>
    Suggest-it 2020 Exam
</StickyFooter>
  </div>
);

export default Router;
