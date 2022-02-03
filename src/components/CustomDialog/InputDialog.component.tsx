import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        insertName: {
            marginBottom: theme.spacing(3),
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
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(textFieldInput)
            }}
        >
            <DialogTitle>{headerText}</DialogTitle>
            <DialogContent>
                <TextField
                    id="input-dialog-textfield"
                    inputProps={{ maxLength: characterLimit }}
                    helperText={`${textFieldInput.length}/${characterLimit}`}
                    autoFocus
                    className={classes.insertName}
                    value={textFieldInput}
                    variant="filled"
                    onChange={(e) => {
                        setTextFieldInput(e.target.value)
                    }}
                    label={labelText}
                    style={{ width: "100%" }}
                />
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <DialogButton
                        disabled={!textFieldInput}
                        type="submit"
                        variant="contained"
                    >
                        {saveText}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setTextFieldInput("")
                    }}
                >
                    {cancelText}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
