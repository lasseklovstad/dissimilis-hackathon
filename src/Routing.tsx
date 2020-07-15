import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

import DashboardView from './views/DashboardView/DashboardView';
import LoginView from './views/LoginView/LoginView';
import SongView from './views/SongView/SongView';
import CommonView from './views/CommonView/CommonView';
<<<<<<< HEAD
import { TryLoginView } from './views/TryLoginView/TryLoginView';
=======
import SongContextProvider from './views/SongView/SongContextProvider.component';
>>>>>>> ff48f7d9fafbdbd13feeb14c6cecfa4c87f2c42c

function SongRouting() {
    return (
        <Switch>
            <SongContextProvider>
                <Route exact path="/song/:id" component={SongView} />
                <Route exact path="/song" component={SongView} />
            </SongContextProvider>
        </Switch>

    )
}

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
<<<<<<< HEAD
                <Route exact path="/" component={LoginView} />
                <Route exact path="/login" component={TryLoginView} />
                <Route exact path="/dashboard" component={DashboardView} />
                <Route exact path="/song" component={SongView} />
                <Route exact path="/song/:id" component={SongView} />


                <Route exact path="/common" component={CommonView} />
=======
                <Route path="/dashboard" component={DashboardView} />
                <Route path="/common" component={CommonView} />
                <Route path="/song" component={SongRouting} />

                <Route path="/" component={LoginView} />
>>>>>>> ff48f7d9fafbdbd13feeb14c6cecfa4c87f2c42c
                <Route render={() => <Redirect to={{ pathname: "/" }} />} />


            </Switch>
        </BrowserRouter>
    );
}

export default Routing;