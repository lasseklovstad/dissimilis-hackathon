import React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"

import { DashboardView } from "./views/DashboardView/DashboardView"
import { LoginView } from "./views/LoginView/LoginView"
import { SongView } from "./views/SongView/SongView"
import { PrivateRoute } from "./PrivateRoute"
import { ExportView } from "./views/ExportView/ExportView"
import { LibraryView } from "./views/LibrayView/LibraryView"
import { AdminView } from "./views/AdminView/AdminView"
import { GroupAdminView } from "./views/AdminView/GroupAdminView"

export const SongRouting = () => {
    return (
        <Switch>
            <Route
                exact
                path="/song/:songId/export"
                render={() => (
                    <PrivateRoute
                        path="/song/:songId/export"
                        component={ExportView}
                    />
                )}
            />
            <Route
                exact
                path="/song/:songId"
                render={() => (
                    <PrivateRoute path="/song/:songId" component={SongView} />
                )}
            />
            <Route
                exact
                path="/song"
                render={() => (
                    <PrivateRoute path="/song" component={SongView} />
                )}
            />
        </Switch>
    )
}

export const Routing = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    exact
                    path="/dashboard"
                    render={() => (
                        <PrivateRoute
                            exact
                            path="/dashboard"
                            component={DashboardView}
                        />
                    )}
                />
                <Route
                    exact
                    path="/library"
                    render={() => (
                        <PrivateRoute
                            exact
                            path="/library"
                            component={LibraryView}
                        />
                    )}
                />
                <Route
                    exact
                    path="/admin"
                    render={() => (
                        <PrivateRoute
                            exact
                            path="/admin"
                            component={AdminView}
                        />
                    )}
                />
                <Route
                    exact
                    path="/admin/organisation/:organisationId"
                    render={() => (
                        <PrivateRoute
                            exact
                            path="/admin/organisation/:organisationId"
                            component={GroupAdminView}
                        />
                    )}
                />
                <Route path="/song" component={SongRouting} />
                <Route path="/" component={LoginView} />
                <Route render={() => <Redirect to={{ pathname: "/" }} />} />
            </Switch>
        </BrowserRouter>
    )
}
