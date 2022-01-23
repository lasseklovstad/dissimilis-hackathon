import React from "react"
import { CircularProgress, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        loading: {
            margin: theme.spacing(1),
            marginRight: theme.spacing(2),
            justifyContent: "center",
            alignContent: "center",
            minWidth: "64px",
            maxWidth: "64px",
        },
    }
})

export const ChoiceDialog = (props: {
    handleOnCancelClick: () => void
    handleOnSaveClick: () => void
    cancelText: string
    headerText: string
    ackText: string
    descriptionText: string
    isLoading?: boolean
}) => {
    const {
        isLoading,
        headerText,
        descriptionText,
        ackText,
        handleOnSaveClick,
        cancelText,
        handleOnCancelClick,
    } = props

    const classes = useStyles()

    return (
        <>
            <DialogTitle>{headerText}</DialogTitle>
            <DialogContent>
                <Typography gutterBottom>{descriptionText}</Typography>
            </DialogContent>

            <DialogActions>
                {isLoading ? (
                    <div className={classes.loading}>
                        <CircularProgress size={24} />
                    </div>
                ) : (
                    <DialogButton
                        onClick={handleOnSaveClick}
                        variant="contained"
                    >
                        {ackText}
                    </DialogButton>
                )}

                <DialogButton onClick={handleOnCancelClick}>
                    {cancelText}
                </DialogButton>
            </DialogActions>
        </>
    )
}
