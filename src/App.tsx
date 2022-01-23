import React from "react"
import "./App.css"
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Routing } from "./Routing"
import { theme } from "./theme"
import { SnackbarContextProvider } from "./utils/snackbarContextProvider.component"
import { BrowserRouter } from "react-router-dom"

export const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <SnackbarContextProvider>
                        <CssBaseline />
                        <Routing />
                    </SnackbarContextProvider>
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
