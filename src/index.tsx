import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';

import LandingView from './views/LandingView/LandingView';
import LoginView from './views/LoginView/LoginView';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={LandingView} />
            <Route exact path="/login" component={LoginView} />


            <Route render={() => <Redirect to={{pathname: "/"}} />} />
        </Switch>
    </BrowserRouter>
    , (document.getElementById('root')));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
