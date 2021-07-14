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

const useStyles = makeStyles((theme) => {
    return {
        formControl: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
            minWidth: 120,
            width: "100%",
        },
        caption: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(3),
        },
        inputElements: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
    }
})

export const InviteUserToSystemDialog = (props: {
    handleOnSaveClick: (value: string) => void
    handleOnCancelClick: () => void
    listOfCountries: string[]
    listOfGroups: string[]
    defaultCountry: string
    isLoading?: boolean
}) => {
    const {
        handleOnSaveClick,
        handleOnCancelClick,
        listOfCountries,
        listOfGroups,
        isLoading,
        defaultCountry,
    } = props
    const { t } = useTranslation()
    const classes = useStyles()

    const [textFieldInput, setTextFieldInput] = useState("")
    const [countryInput, setCountryInput] = useState("")
    const [groupInput, setGroupInput] = useState("")

    useEffect(() => {
        if (defaultCountry) {
            setCountryInput(defaultCountry)
        }
    }, [defaultCountry])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(textFieldInput)
            }}
        >
            <DialogTitle> {t("AdminView.inviteUser")} </DialogTitle>
            <DialogContent>
                <Typography variant="caption" className={classes.caption}>
                    {t("AdminView.newUserCountry")}
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

                <Typography variant="caption" className={classes.caption}>
                    {t("AdminView.newUserGroup")}
                </Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>{t("AdminView.group")}</InputLabel>
                    <Select
                        value={groupInput}
                        onChange={(e: React.ChangeEvent<{ value: any }>) => {
                            setGroupInput(e.target.value)
                        }}
                        label={t("AdminView.groups")}
                    >
                        <MenuItem value=""> {t("AdminView.noGroup")} </MenuItem>
                        {listOfGroups.map((group) => {
                            return <MenuItem value={group}> {group} </MenuItem>
                        })}
                    </Select>
                </FormControl>

                <Typography variant="caption" className={classes.caption}>
                    {t("AdminView.newUserEmail")}
                </Typography>
                <TextField
                    id="input-dialog-textfield"
                    inputProps={{ maxLength: 250 }}
                    helperText={`${textFieldInput.length}/${250}`}
                    value={textFieldInput}
                    className={classes.inputElements}
                    variant="filled"
                    onChange={(e) => {
                        setTextFieldInput(e.target.value)
                    }}
                    label={"Epost"}
                    style={{ width: "100%" }}
                />
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <DialogButton
                        disabled={!textFieldInput || !countryInput}
                        type="submit"
                        variant="contained"
                    >
                        {"Inviter bruker"}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setTextFieldInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
