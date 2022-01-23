import React from "react"
import "./App.css"
import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { Routing } from "./Routing"
import { theme } from "./theme"
import { SnackbarContextProvider } from "./utils/snackbarContextProvider.component"

export const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <SnackbarContextProvider>
                <CssBaseline />
                <Routing />
            </SnackbarContextProvider>
        </MuiThemeProvider>
    )
}
