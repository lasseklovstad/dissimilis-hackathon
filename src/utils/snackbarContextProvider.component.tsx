import React, { ReactNode, useContext, useState } from "react"
import { Alert, Snackbar, SnackbarProps } from "@mui/material"

interface ISnackbar {
    launchSnackbar: (text: string, isError: boolean) => void
}

const SnackbarContext = React.createContext<ISnackbar | undefined>(undefined)

export const SnackbarContextProvider = (props: { children: ReactNode }) => {
    const { children } = props
    const [isOpen, setIsOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [text, setText] = useState("")
    const launchSnackbar = (text: string, isError: boolean) => {
        setIsOpen(true)
        setIsError(isError)
        setText(text)
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleCloseSnack: SnackbarProps["onClose"] = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        handleClose()
    }

    return (
        <SnackbarContext.Provider
            value={{
                launchSnackbar,
            }}
        >
            {children}
            <Snackbar
                open={isOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    onClose={handleClose}
                    severity={isError ? "error" : "success"}
                >
                    {text}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
}

export const useSnackbarContext = () => {
    const context = useContext(SnackbarContext)
    if (!context) {
        throw new Error(
            "useSnackbarContext must be used within SnackbarContextProvider"
        )
    }
    return context
}
