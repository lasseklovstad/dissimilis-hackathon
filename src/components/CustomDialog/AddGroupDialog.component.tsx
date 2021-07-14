import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
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

export const AddGroupDialog = (props: {
    handleOnSaveClick: (value: string) => void
    handleOnCancelClick: () => void
    listOfCountries: string[]
    defaultCountry?: string
    isLoading?: boolean
    userList: IUser[]
}) => {
    const {
        handleOnSaveClick,
        handleOnCancelClick,
        isLoading,
        listOfCountries,
        userList,
        defaultCountry,
    } = props

    const { t } = useTranslation()
    const classes = useStyles()

    const [groupNameInput, setGroupNameInput] = useState("")
    const [countryInput, setCountryInput] = useState("")

    const [adminEmailInput, setAdminEmailInput] = useState("")

    const adminListProps = {
        options: userList,
        getOptionLabel: (user: IUser) => user.email,
    }

    useEffect(() => {
        if (defaultCountry) {
            setCountryInput(defaultCountry)
        }
    }, [defaultCountry])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick("")
            }}
        >
            <DialogTitle> {t("AdminView.addGroup")} </DialogTitle>
            <DialogContent>
                <Typography variant="caption">
                    {t("AdminView.newGroupName")}
                </Typography>
                <TextField
                    id="input-dialog-textfield"
                    inputProps={{ maxLength: 250 }}
                    helperText={`${groupNameInput.length}/${250}`}
                    autoFocus
                    className={classes.inputElements}
                    value={groupNameInput}
                    variant="filled"
                    onChange={(e) => {
                        setGroupNameInput(e.target.value)
                    }}
                    label={t("AdminView.groupName")}
                    style={{ width: "100%" }}
                />
                <Typography variant="caption">
                    {t("AdminView.newGroupCountry")}
                </Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>{t("AdminView.countries")}</InputLabel>
                    <Select
                        value={countryInput}
                        onChange={(e: React.ChangeEvent<{ value: any }>) => {
                            setCountryInput(e.target.value)
                        }}
                        label={t("AdminView.countries")}
                    >
                        {listOfCountries.map((country) => {
                            return (
                                <MenuItem value={country}> {country} </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <Typography variant="caption">
                    {t("AdminView.emailNewAdmin")}
                </Typography>
                <Autocomplete
                    {...adminListProps}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    inputValue={adminEmailInput}
                    onInputChange={(event, newInputValue) => {
                        setAdminEmailInput(newInputValue)
                    }}
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
                        disabled={
                            !groupNameInput || !adminEmailInput || !countryInput
                        }
                        type="submit"
                        variant="contained"
                    >
                        {t("Dialog.create")}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setGroupNameInput("")
                        setAdminEmailInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
