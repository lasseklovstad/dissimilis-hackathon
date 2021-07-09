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
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        paragraph: {
            marginBottom: theme.spacing(1.5),
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
