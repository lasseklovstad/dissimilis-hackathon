import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

export const PrivateRoute: React.FC<RouteProps> = props => {
    if (sessionStorage.getItem("apiKey") && sessionStorage.getItem("userId")) {
        return <Route {...props} component={props.component} />;
    } else {
        return <Redirect to={{ pathname: '/' }} />;
    }
};

export default PrivateRoute;