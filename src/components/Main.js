import React from 'react';
import {Register } from './Register';
import { Login } from './Login';
import { Switch, Route, Redirect} from 'react-router-dom';

export class Main extends React.Component {
    getLogin = () => {
        return <Redirect to="/login" />
    }
    render() {
        return (
            <div className="main">
                <Switch>
                    <Route exact path={"/"} render={this.getLogin}/>
                    <Route path={"/register"} component={Register}/>
                    <Route path={"/login"} component={Login}/>
                    <Route render={this.getLogin} />
                </Switch>
            </div>

        );
    }
}