import React from "react"
import "./App.css"
import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import * as dotenv from "dotenv"
import { Routing } from "./Routing"
import { theme } from "./theme"
import { useEffect } from "react"
import i18n from "i18next"

export const App = () => {
    dotenv.config()

    useEffect(() => {
        const userLanguage = localStorage.getItem("userLanguage")
        if (userLanguage) {
            i18n.changeLanguage(userLanguage)
        }
    })

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Routing />
            </MuiThemeProvider>
        </div>
    )
}
