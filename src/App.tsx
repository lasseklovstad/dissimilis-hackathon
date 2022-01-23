import React from "react"
import "./App.css"
import {
    ThemeProvider,
    Theme,
    StyledEngineProvider,
} from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Routing } from "./Routing"
import { theme } from "./theme"
import { SnackbarContextProvider } from "./utils/snackbarContextProvider.component"

export const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SnackbarContextProvider>
                    <CssBaseline />
                    <Routing />
                </SnackbarContextProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
