import React from 'react';
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';

import DashboardView from './views/DashboardView/DashboardView';
import LoginView from './views/LoginView/LoginView';

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LoginView} />
                <Route exact path="/dashboard" component={DashboardView} />
                <Route exact path="/song" component={DashboardView} />
                <Route exact path="/song/:id" component={DashboardView} /> 
                        
                <Route render={() => <Redirect to={{pathname: "/"}} />} />
            </Switch>
        </BrowserRouter>
      );
}

export default Routing;