import React, { useEffect, useState } from "react"
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
import { useGetUsers } from "../../utils/useApiServiceUsers"

const useStyles = makeStyles((theme) => {
    return {
        inputElements: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
    }
})

export const AddOrganisationDialog = (props: {
    handleOnSaveClick: (name: string, firstAdminId?: number) => void
    handleOnCancelClick: () => void
    isLoading?: boolean
}) => {
    const { handleOnSaveClick, handleOnCancelClick, isLoading } = props

    const { t } = useTranslation()
    const classes = useStyles()

    const { users } = useGetUsers()

    const [organisationNameInput, setOrganisationNameInput] = useState("")
    const [adminEmailInput, setAdminEmailInput] = useState("")

    const [userList, setUserList] = useState<IUser[]>()

    const adminListProps = {
        options: userList || [],
        getOptionLabel: (user: IUser) => user.email,
    }

    useEffect(() => {
        if (users) {
            setUserList(users)
        }
    }, [users])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(
                    organisationNameInput,
                    userList?.find((user) => user.email === adminEmailInput)
                        ?.userId
                )
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
                    helperText={`${organisationNameInput.length}/${250}`}
                    autoFocus
                    className={classes.inputElements}
                    value={organisationNameInput}
                    variant="filled"
                    onChange={(e) => {
                        setOrganisationNameInput(e.target.value)
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
                        disabled={!organisationNameInput || !adminEmailInput}
                        type="submit"
                        variant="contained"
                    >
                        {t("Dialog.create")}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setOrganisationNameInput("")
                        setAdminEmailInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
