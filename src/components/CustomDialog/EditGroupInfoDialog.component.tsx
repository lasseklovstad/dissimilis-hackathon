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
import { IOrganisation } from "../../models/IOrganisation"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { IGroup } from "../../models/IGroup"

const useStyles = makeStyles((theme) => {
    return {
        textFields: {
            marginBottom: theme.spacing(0.5),
        },
    }
})

export const EditGroupInfoDialog = (props: {
    groupId: number
    group: IOrganisation | IGroup // Temporary
    isGroup: boolean
    handleOnSaveClick: () => void
    handleOnCancelClick: () => void
    characterLimit?: number
    isLoadingPatch?: boolean
}) => {
    const {
        groupId,
        group,
        isGroup,
        handleOnSaveClick,
        handleOnCancelClick,
        characterLimit = 250,
        isLoadingPatch,
    } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const [groupNameTextFieldInput, setGroupNameTextFieldInput] = useState("")
    const [groupAddressTextFieldInput, setGroupAddressTextFieldInput] =
        useState("")
    const [groupPhoneNumberTextFieldInput, setGroupPhoneNumberTextFieldInput] =
        useState("")
    const [groupEmailTextFieldInput, setGroupEmailTextFieldInput] = useState("")
    const [groupNotesTextFieldInput, setGroupNotesTextFieldInput] = useState("")

    useEffect(() => {
        setGroupNameTextFieldInput(group.name || "")
        setGroupAddressTextFieldInput(group.address || "")
        setGroupPhoneNumberTextFieldInput(group.phoneNumber || "")
        setGroupEmailTextFieldInput(group.email || "")
        setGroupNotesTextFieldInput(group.notes || "")
    }, [group])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick()
            }}
        >
            <DialogTitle>
                {isGroup
                    ? t("Dialog.groupDetails")
                    : t("Dialog.countryDetails")}
            </DialogTitle>
            <DialogContent>
                <TextField
                    id="group-info-dialog-group-name-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupNameTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={groupNameTextFieldInput}
                    onChange={(e) => {
                        setGroupNameTextFieldInput(e.target.value)
                    }}
                    label={
                        isGroup
                            ? t("Dialog.nameOfGroup")
                            : t("Dialog.nameOfCountry")
                    }
                    fullWidth={true}
                    required
                />
                <TextField
                    id="group-info-dialog-group-address-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupAddressTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={groupAddressTextFieldInput}
                    onChange={(e) => {
                        setGroupAddressTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.addressOfCountry")}
                    fullWidth={true}
                />
                <TextField
                    id="group-info-dialog-group-phone-number-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupPhoneNumberTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={groupPhoneNumberTextFieldInput}
                    onChange={(e) => {
                        setGroupPhoneNumberTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.phoneNumberOfCountry")}
                    fullWidth={true}
                    type="tel"
                />
                <TextField
                    id="group-info-dialog-group-email-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupEmailTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={groupEmailTextFieldInput}
                    onChange={(e) => {
                        setGroupEmailTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.emailOfCountry")}
                    fullWidth={true}
                    type="email"
                />
                <TextField
                    id="group-info-dialog-group-notes-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupNotesTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    autoFocus
                    variant="filled"
                    value={groupNotesTextFieldInput}
                    onChange={(e) => {
                        setGroupNotesTextFieldInput(e.target.value)
                    }}
                    label={
                        isGroup
                            ? t("Dialog.informationAboutGroup")
                            : t("Dialog.informationAboutCountry")
                    }
                    fullWidth={true}
                    multiline
                />
            </DialogContent>
            <DialogActions>
                {isLoadingPatch ? (
                    <CircularProgress aria-label="Loading" size={24} />
                ) : (
                    <DialogButton
                        disabled={!groupNameTextFieldInput.trim()}
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
