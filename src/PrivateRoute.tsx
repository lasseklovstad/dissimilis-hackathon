import React from "react"
import { Redirect, Route, RouteProps } from "react-router"

export const PrivateRoute = (props: RouteProps) => {
    if (sessionStorage.getItem("apiKey") && sessionStorage.getItem("userId")) {
        return <Route {...props} component={props.component} />
    }
    return <Redirect to={{ pathname: "/" }} />
}
