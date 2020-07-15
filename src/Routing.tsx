import React from 'react';
import { Route, BrowserRouter, Switch, Redirect, useParams } from 'react-router-dom';

import DashboardView from './views/DashboardView/DashboardView';
import LoginView from './views/LoginView/LoginView';
import SongView from './views/SongView/SongView';
import CommonView from './views/CommonView/CommonView';
import SongContextProvider from './views/SongView/SongContextProvider.component';

function SongRouting() {
    return (
        <Switch>
            <SongContextProvider>
                <Route path="/song/:id" component={SongView} />
            </SongContextProvider>
        </Switch>

    )
}

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/dashboard" component={DashboardView} />
                <Route path="/common" component={CommonView} />
                <Route path="/song/:id" component={SongRouting} />

                <Route path="/" component={LoginView} />
                <Route render={() => <Redirect to={{ pathname: "/" }} />} />


            </Switch>
        </BrowserRouter>
    );
}

export default Routing;