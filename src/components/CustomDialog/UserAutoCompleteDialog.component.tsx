import React, { useState } from "react"
import {
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material"

import makeStyles from "@mui/styles/makeStyles"

import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { useTranslation } from "react-i18next"
import { Autocomplete } from "@mui/material"
import { IUser } from "../../models/IUser"

const useStyles = makeStyles((theme) => {
    return {
        inputElements: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
        formControl: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
            minWidth: 120,
            width: "100%",
        },
    }
})

export const UserAutoCompleteDialog = (props: {
    handleOnSaveClick: (value: IUser | undefined) => void
    handleOnCancelClick: () => void
    isLoading?: boolean
    userList: IUser[]
    title: string
    descriptionText?: string
    saveText: string
}) => {
    const {
        handleOnSaveClick,
        handleOnCancelClick,
        isLoading,
        userList,
        title,
        descriptionText = "",
        saveText,
    } = props

    const { t } = useTranslation()
    const classes = useStyles()

    const [userInput, setUserInput] = useState("")

    const userListProps = {
        options: userList,
        getOptionLabel: (user: IUser) => user.email,
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(
                    userList.find((user) => user.email === userInput)
                )
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="caption">{descriptionText}</Typography>
                <Autocomplete
                    {...userListProps}
                    inputValue={userInput}
                    onInputChange={(event, newInputValue) => {
                        setUserInput(newInputValue)
                    }}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    style={{ width: "100%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t("Dialog.email")}
                            margin="normal"
                            variant="filled"
                            className={classes.inputElements}
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <DialogButton
                        disabled={!userInput}
                        type="submit"
                        variant="contained"
                    >
                        {saveText}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setUserInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
