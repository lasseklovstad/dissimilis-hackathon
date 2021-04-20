import { HashRouter } from "react-router-dom"
import React, { ReactNode } from "react"

// Wrapper for tester som krever router
// Wrapper kan utvides med f.eks. ThemeProvider, Context, Provider osv.
export const TestWrapper = (props: { children: ReactNode }) => {
    const { children } = props
    return (
        <HashRouter>
            {children}
        </HashRouter>
    )
}
