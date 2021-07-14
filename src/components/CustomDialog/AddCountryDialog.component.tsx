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
    }
})

export const AddCountryDialog = (props: {
    handleOnSaveClick: (value: string) => void
    handleOnCancelClick: () => void
    isLoading?: boolean
    userList: IUser[]
}) => {
    const { handleOnSaveClick, handleOnCancelClick, isLoading, userList } =
        props

    const { t } = useTranslation()
    const classes = useStyles()

    const [countryNameInput, setCountryNameInput] = useState("")
    const [adminEmailInput, setAdminEmailInput] = useState("")

    const adminListProps = {
        options: userList,
        getOptionLabel: (user: IUser) => user.email,
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick("")
            }}
        >
            <DialogTitle> {t("AdminView.addCountry")} </DialogTitle>
            <DialogContent>
                <Typography variant="caption">
                    {t("AdminView.newCountryName")}
                </Typography>
                <TextField
                    id="input-dialog-textfield"
                    inputProps={{ maxLength: 250 }}
                    helperText={`${countryNameInput.length}/${250}`}
                    autoFocus
                    className={classes.inputElements}
                    value={countryNameInput}
                    variant="filled"
                    onChange={(e) => {
                        setCountryNameInput(e.target.value)
                    }}
                    label={t("AdminView.countryName")}
                    style={{ width: "100%" }}
                />
                <Typography variant="caption">
                    {t("AdminView.emailNewAdmin")}
                </Typography>
                <Autocomplete
                    {...adminListProps}
                    id="auto-complete"
                    autoComplete
                    inputValue={adminEmailInput}
                    onInputChange={(event, newInputValue) => {
                        setAdminEmailInput(newInputValue)
                    }}
                    includeInputInList
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
                        disabled={!countryNameInput || !adminEmailInput}
                        type="submit"
                        variant="contained"
                    >
                        {t("Dialog.create")}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setCountryNameInput("")
                        setAdminEmailInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
