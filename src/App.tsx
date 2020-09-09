import React from "react"
import "./App.css"
import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import * as dotenv from "dotenv"
import { Routing } from "./Routing"
import { theme } from "./theme"

export const App = () => {
    dotenv.config()

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Routing />
            </MuiThemeProvider>
        </div>
    )
}
