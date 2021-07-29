import React, { ReactNode, useContext, useState } from "react"
import { makeStyles, Snackbar, Theme } from "@material-ui/core"
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert"

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
    alertText: {
        marginTop: theme.spacing(1.2),
    },
}))

interface ISnackbar {
    launchSnackbar: (text: string, isError: boolean) => void
}

const SnackbarContext = React.createContext<ISnackbar | undefined>(undefined)

export const SnackbarContextProvider = (props: { children: ReactNode }) => {
    const { children } = props
    const [isOpen, setIsOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [text, setText] = useState("")
    const classes = useStyles()
    const launchSnackbar = (text: string, isError: boolean) => {
        setIsOpen(true)
        setIsError(isError)
        setText(text)
    }
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return
        }
        setIsOpen(false)
    }

    return (
        <SnackbarContext.Provider
            value={{
                launchSnackbar,
            }}
        >
            {children}
            <div className={classes.root}>
                <Snackbar
                    open={isOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity={isError ? "error" : "success"}
                    >
                        <div className={classes.alertText}>{text}</div>
                    </Alert>
                </Snackbar>
            </div>
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