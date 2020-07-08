import React from 'react';
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';

import DashboardView from './views/DashboardView/DashboardView';
import LoginView from './views/LoginView/LoginView';
import SongView from './views/SongView/SongView';

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LoginView} />
                <Route exact path="/dashboard" component={DashboardView} />
                <Route exact path="/song" component={SongView} />
                <Route exact path="/song/:id" component={SongView} /> 
                        
                <Route render={() => <Redirect to={{pathname: "/"}} />} />
            </Switch>
        </BrowserRouter>
      );
}

export default Routing;