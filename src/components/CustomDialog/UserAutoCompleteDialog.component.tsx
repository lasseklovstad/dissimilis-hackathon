import React, { useState } from "react"
import {
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    TextField,
    Typography,
} from "@material-ui/core"

import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { useTranslation } from "react-i18next"
import { Autocomplete } from "@material-ui/lab"
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
    handleOnSaveClick: (user: IUser | undefined) => void
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

    const adminListProps = {
        options: userList,
        getOptionLabel: (user: IUser) => user.email,
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(
                    // Return corresponding IUser matching entered email
                    // userList.find((user) => user.email === userInput) // need getUsers-apiCall
                    {
                        // FJERN
                        userId: 2,
                        name: "Håkon",
                        email: "hakon.anders.stromsodd@ciber.no",
                        isSystemAdmin: true,
                    }
                )
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="caption">{descriptionText}</Typography>
                <Autocomplete
                    freeSolo // DEVELOPMENT
                    {...adminListProps}
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
                            label={t("AdminView.email")}
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
