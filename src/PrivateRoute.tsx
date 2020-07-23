import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { AuthContext } from './contexts/auth';


export const PrivateRoute: React.FC<RouteProps> = props => {
    console.log("Kjører private routing");

    if (sessionStorage.getItem("apiKey")) {
        return <Route {...props} component={props.component} />;
    } else {
        return <Redirect to={{ pathname: '/' }} />;
    }
};

export default PrivateRoute;