import React from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';

import { Register } from './Register';
import { Login } from './Login';
import { Home } from './Home';


export class Main extends React.Component {
  getRedirect = () => {
    return this.props.isLoggedIn ?
      <Redirect to="/home" /> : <Redirect to="/login" />;
  }

  getHome = () => {
    return this.props.isLoggedIn ?
      <Home/> : <Redirect to="/login"/>;
  }

  getLogin = () => {
    return this.props.isLoggedIn ?
      <Redirect to="/home" /> : <Login handleLogin={this.props.handleLogin} />
  }

  render() {
    return (
      <div className="main">
        <Switch>
          <Route exact path={"/"} render={this.getRedirect} />
          <Route path={"/register"} component={Register} />
          <Route path={"/login"} render={this.getLogin} />
          <Route path={"/home"} render={this.getHome} />
          <Route render={this.getRedirect} />
        </Switch>
      </div>
    );
  }
}