import { HashRouter } from "react-router-dom"
import React, { ReactNode } from "react"
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles"
import { I18nextProvider } from "react-i18next"
import i18n from "./i18n"
import { theme } from "./theme"

// Wrapper for tester som krever router og strings som oversettes med i18next
// Wrapper kan utvides med f.eks. ThemeProvider, Context, Provider osv.
export const TestWrapper = (props: { children?: ReactNode }) => {
    const { children } = props
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <HashRouter>
                    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
                </HashRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
