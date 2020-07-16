import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { AuthContext } from './contexts/auth';


export const PrivateRoute: React.FC<RouteProps> = props => {

    const { isLoggedIn } = React.useContext(AuthContext)
    console.log(isLoggedIn);
    if (isLoggedIn) {
        return <Route {...props} component={props.component} />;
    } else {
        return <Redirect to={{ pathname: '/' }} />;
    }
};
export default PrivateRoute;