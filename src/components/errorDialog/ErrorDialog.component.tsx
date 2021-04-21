import React, { useEffect, useState } from "react"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { AxiosError } from "axios"
import { IServerError } from "../../models/IServerError"

type ErrorDialogProps = {
    isError: boolean
    error: AxiosError<IServerError> | undefined
    title?: string
}

export const ErrorDialog = (props: ErrorDialogProps) => {
    const { isError, error, title } = props
    const [open, setOpen] = useState(isError)
    const { t } = useTranslation()

    const handleClose = () => {
        setOpen(false)
    }

    const getErrorMessage = () => {
        return error?.response?.data.title || error?.message
    }

    // Open dialog if error is present
    useEffect(() => {
        if (isError) {
            setOpen(true)
        }
    }, [isError])

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>{title || t("Modal.errorTitle")}</DialogTitle>
            <DialogContent>
                <DialogContentText>{getErrorMessage()}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}
