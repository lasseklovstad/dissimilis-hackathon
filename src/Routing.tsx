import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

import DashboardView from './views/DashboardView/DashboardView';
import LoginView from './views/LoginView/LoginView';
import SongView from './views/SongView/SongView';

import SongContextProvider from './views/SongView/SongContextProvider.component';
import SongToolsContextProvider from './views/SongView/SongToolsContextProvider.component';
import PrivateRoute from './PrivateRoute';
import ExportView from './views/ExportView/ExportView';
import { LibraryView } from './views/LibrayView/LibraryView';

function SongRouting() {
    return (
        <Switch>
            <SongContextProvider>
                <SongToolsContextProvider>
                    <Route exact path="/song/:id/export" render={(props) => (<PrivateRoute path="/song/:id/export" component={ExportView} />)} />
                    <Route exact path="/song/:id" render={(props) => (<PrivateRoute path="/song/:id" component={SongView} />)} />
                    <Route exact path="/song" render={(props) => (<PrivateRoute path="/song" component={SongView} />)} />
                </SongToolsContextProvider>
            </SongContextProvider>
        </Switch>

    )
}

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/dashboard" render={(props) => (<PrivateRoute exact path="/dashboard" component={DashboardView} />)} />
                <Route exact path="/library" render={(props) => (<PrivateRoute exact path="/library" component={LibraryView} />)} />
                <Route path="/song" component={SongRouting} />
                <Route path="/" component={LoginView} />
                <Route render={() => <Redirect to={{ pathname: "/" }} />} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routing;