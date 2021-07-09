import React from "react"
import {
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core"

import { LoadingLogo } from "../loadingLogo/LoadingLogo.component"
import { DialogButton } from "../CustomModalComponents/DialogButton.components"

const useStyles = makeStyles({
    modal: {
        position: "absolute",
        boxShadow: "0 3px 6px 2px rgba(0, 0, 0, 0.1)",
        height: "auto",
        borderRadius: 2,
        backgroundColor: "white",
        padding: "40px",
        "@media (max-width: 600px)": {
            width: "80%",
            padding: "48px",
        },
        outline: "none",
    },
    title: {
        marginBottom: "8px",
    },
    paragraph: {
        marginBottom: "24px",
    },
    container: {
        width: "100%",
    },
})

export const ChoiceModal = (props: {
    handleOnCancelClick: () => void
    handleOnSaveClick: () => void
    cancelText: string
    headerText: string
    ackText: string
    descriptionText: string
    isLoading?: boolean
}) => {
    const classes = useStyles()

    const {
        isLoading,
        headerText,
        descriptionText,
        ackText,
        handleOnSaveClick,
        cancelText,
        handleOnCancelClick,
    } = props

    return (
        <Grid container>
            {isLoading ? (
                <Grid item xs={12}>
                    <LoadingLogo />
                </Grid>
            ) : (
                <Box>
                    <Grid item xs={12}>
                        <DialogTitle>{headerText}</DialogTitle>
                        <DialogContent>
                            <Typography className={classes.paragraph}>
                                {descriptionText}
                            </Typography>
                        </DialogContent>
                    </Grid>

                    <DialogActions>
                        <Grid item xs={12}>
                            <DialogButton
                                buttonText={ackText}
                                onClick={() => handleOnSaveClick()}
                                isCancelButton={false}
                            />
                            <DialogButton
                                buttonText={cancelText}
                                onClick={() => handleOnCancelClick()}
                                isCancelButton
                            />
                        </Grid>
                    </DialogActions>
                </Box>
            )}
        </Grid>
    )
}
