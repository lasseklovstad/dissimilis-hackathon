import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

import DashboardView from './views/DashboardView/DashboardView';
import LoginView from './views/LoginView/LoginView';
import SongView from './views/SongView/SongView';
import CommonView from './views/CommonView/CommonView';

import SongContextProvider from './views/SongView/SongContextProvider.component';
import PrivateRoute from './PrivateRoute';

function SongRouting() {
    return (
        <Switch>
            <SongContextProvider>
                <PrivateRoute path="/song/:id" component={SongView} />
                <PrivateRoute path="/song" component={SongView} />


            </SongContextProvider>
        </Switch>

    )
}

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <PrivateRoute path="/dashboard" component={DashboardView} />
                <PrivateRoute path="/common" component={CommonView} />
                <PrivateRoute path="/song" component={SongRouting} />

                <Route path="/" component={LoginView} />
                <Route render={() => <Redirect to={{ pathname: "/" }} />} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routing;