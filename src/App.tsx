import React from 'react';
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';

import LandingView from './views/LandingView/LandingView';
import LoginView from './views/LoginView/LoginView';

function App() {
  return (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={LandingView} />
            <Route exact path="/login" component={LoginView} />


            <Route render={() => <Redirect to={{pathname: "/"}} />} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;