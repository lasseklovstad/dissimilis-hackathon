import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"

import { DashboardView } from "./views/DashboardView/DashboardView"
import { LoginView } from "./views/LoginView/LoginView"
import { SongView } from "./views/SongView/SongView"
import { ExportView } from "./views/ExportView/ExportView"
import { LibraryView } from "./views/LibrayView/LibraryView"
import { AdminView } from "./views/AdminView/AdminView"
import { GroupAdminView } from "./views/AdminView/GroupAdminView"
import { SongContextProvider } from "./context/song/SongContextProvider.component"
import { UserContextProvider } from "./components/UserContextProvider/UserContextProvider"

export const SongRouting = () => {
    return (
        <SongContextProvider>
            <Switch>
                <Route
                    exact
                    path="/song/:songId/export"
                    component={ExportView}
                />
                <Route exact path="/song/:songId" component={SongView} />
            </Switch>
        </SongContextProvider>
    )
}

export const Routing = () => {
    const PrivateRoutes = () => {
        if (
            sessionStorage.getItem("apiKey") &&
            sessionStorage.getItem("userId")
        ) {
            return (
                <UserContextProvider>
                    <Switch>
                        <Route
                            exact
                            path="/dashboard"
                            component={DashboardView}
                        />
                        <Route exact path="/library" component={LibraryView} />
                        <Route exact path="/admin" component={AdminView} />
                        <Route
                            exact
                            path="/admin/organisation/:organisationId"
                            component={GroupAdminView}
                        />
                        <Route path="/song" component={SongRouting} />
                    </Switch>
                </UserContextProvider>
            )
        }
        return <Redirect to={"/"} />
    }
    return (
        <Switch>
            <Route exact path="/" component={LoginView} />
            <Route path={"/**"} component={PrivateRoutes} />
        </Switch>
    )
}
