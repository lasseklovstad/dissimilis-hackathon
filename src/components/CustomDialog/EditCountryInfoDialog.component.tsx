import React from "react"
import {
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    TextField,
} from "@material-ui/core"
import { useEffect } from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ICountry } from "../../models/ICountry"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        textFields: {
            marginBottom: theme.spacing(0.5),
        },
    }
})

export const EditCountryInfoDialog = (props: {
    countryId: number
    country: ICountry // Temporary
    handleOnSaveClick: () => void
    handleOnCancelClick: () => void
    characterLimit?: number
    isLoadingPatch?: boolean
}) => {
    const {
        countryId,
        country,
        handleOnSaveClick,
        handleOnCancelClick,
        characterLimit = 250,
        isLoadingPatch,
    } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const [countryNameTextFieldInput, setCountryNameTextFieldInput] =
        useState("")
    const [countryAddressTextFieldInput, setCountryAddressTextFieldInput] =
        useState("")
    const [
        countryPhoneNumberTextFieldInput,
        setCountryPhoneNumberTextFieldInput,
    ] = useState("")
    const [countryEmailTextFieldInput, setCountryEmailTextFieldInput] =
        useState("")
    const [countryNotesTextFieldInput, setCountryNotesTextFieldInput] =
        useState("")

    useEffect(() => {
        setCountryNameTextFieldInput(country.name || "")
        setCountryAddressTextFieldInput(country.address || "")
        setCountryPhoneNumberTextFieldInput(country.phoneNumber || "")
        setCountryEmailTextFieldInput(country.email || "")
        setCountryNotesTextFieldInput(country.notes || "")
    }, [country])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick()
            }}
        >
            <DialogTitle>{t("Dialog.countryDetails")}</DialogTitle>
            <DialogContent>
                <TextField
                    id="country-info-dialog-country-name-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${countryNameTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={countryNameTextFieldInput}
                    onChange={(e) => {
                        setCountryNameTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.nameOfCountry")}
                    fullWidth={true}
                    required
                />
                <TextField
                    id="country-info-dialog-country-address-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${countryAddressTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={countryAddressTextFieldInput}
                    onChange={(e) => {
                        setCountryAddressTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.addressOfCountry")}
                    fullWidth={true}
                />
                <TextField
                    id="country-info-dialog-country-phone-number-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${countryPhoneNumberTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={countryPhoneNumberTextFieldInput}
                    onChange={(e) => {
                        setCountryPhoneNumberTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.phoneNumberOfCountry")}
                    fullWidth={true}
                    type="tel"
                />
                <TextField
                    id="country-info-dialog-country-email-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${countryEmailTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={countryEmailTextFieldInput}
                    onChange={(e) => {
                        setCountryEmailTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.emailOfCountry")}
                    fullWidth={true}
                    type="email"
                />
                <TextField
                    id="country-info-dialog-country-notes-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${countryNotesTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={countryNotesTextFieldInput}
                    onChange={(e) => {
                        setCountryNotesTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.informationAboutCountry")}
                    fullWidth={true}
                    multiline
                />
            </DialogContent>
            <DialogActions>
                {isLoadingPatch ? (
                    <CircularProgress aria-label="Loading" size={24} />
                ) : (
                    <DialogButton
                        disabled={!countryNameTextFieldInput.trim()}
                        type="submit"
                        variant="contained"
                    >
                        {t("Dialog.save")}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
