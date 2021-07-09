import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    DialogContent,
    Grid,
    makeStyles,
    TextField,
    Typography,
} from "@material-ui/core"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        insertName: {
            marginBottom: theme.spacing(3),
        },

        title: {
            marginBottom: theme.spacing(2),
        },
    }
})

export const InputDialog = (props: {
    defaultValue?: string
    handleOnSaveClick: (value: string) => void
    handleOnCancelClick: () => void
    saveText: string
    cancelText: string
    headerText: string
    labelText: string
    characterLimit?: number
    isLoading?: boolean
}) => {
    const {
        characterLimit = 250,
        defaultValue,
        handleOnSaveClick,
        headerText,
        labelText,
        isLoading,
        saveText,
        cancelText,
        handleOnCancelClick,
    } = props
    const classes = useStyles()
    const [textFieldInput, setTextFieldInput] = useState("")

    useEffect(() => {
        if (defaultValue) {
            setTextFieldInput(defaultValue)
        }
    }, [defaultValue])

    return (
        <DialogContent>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleOnSaveClick(textFieldInput)
                }}
            >
                <Grid container>
                    <Typography className={classes.title} variant="h2">
                        {headerText}
                    </Typography>

                    <Grid item className={classes.insertName} xs={12}>
                        <TextField
                            id="input-dialog-textfield"
                            inputProps={{ maxLength: characterLimit }}
                            helperText={`${textFieldInput.length}/${characterLimit}`}
                            autoFocus
                            value={textFieldInput}
                            variant="filled"
                            onChange={(e) => {
                                setTextFieldInput(e.target.value)
                            }}
                            label={labelText}
                            style={{ width: "100%" }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container>
                            {isLoading ? (
                                <Grid container>
                                    <CircularProgress size={24} />
                                </Grid>
                            ) : (
                                <Grid item>
                                    <DialogButton
                                        disabled={!textFieldInput}
                                        buttonText={saveText}
                                        isCancelButton={false}
                                    />
                                </Grid>
                            )}
                            <Grid item>
                                <DialogButton
                                    buttonText={cancelText}
                                    onClick={() => {
                                        handleOnCancelClick()
                                        setTextFieldInput("")
                                    }}
                                    isCancelButton
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </DialogContent>
    )
}
