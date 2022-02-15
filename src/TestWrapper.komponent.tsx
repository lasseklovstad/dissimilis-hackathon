import { ThemeProvider } from "@mui/material"
import React, { ReactNode } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "./i18n"
import { theme } from "./theme"
import { SnackbarContextProvider } from "./utils/snackbarContextProvider.component"

// Wrapper for tester som krever router og strings som oversettes med i18next
// Wrapper kan utvides med f.eks. ThemeProvider, Context, Provider osv.
export const TestWrapper = (props: { children?: ReactNode }) => {
    const { children } = props
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export const ComponentTestWrapper = (props: { children?: ReactNode }) => {
    const { children } = props
    return (
        <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
                <SnackbarContextProvider>{children}</SnackbarContextProvider>
            </I18nextProvider>
        </ThemeProvider>
    )
}
