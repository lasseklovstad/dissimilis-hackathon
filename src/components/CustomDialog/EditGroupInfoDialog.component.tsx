import React from "react"
import { CircularProgress, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
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
    group: IOrganisation | IGroup | undefined
    isGroup: boolean
    handleOnSaveClick: (
        name: string,
        address: string,
        emailAddress: string,
        description: string,
        phoneNumber: string
    ) => void
    handleOnCancelClick: () => void
    characterLimit?: number
    isLoadingPatch?: boolean
}) => {
    const {
        group,
        isGroup,
        handleOnSaveClick,
        handleOnCancelClick,
        characterLimit = 250,
        isLoadingPatch,
    } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const [groupNameTextFieldInput, setGroupNameTextFieldInput] = useState(
        group
            ? "groupName" in group
                ? group.groupName
                : group.organisationName
            : ""
    )
    const [groupAddressTextFieldInput, setGroupAddressTextFieldInput] =
        useState(group?.address ? group.address : "")
    const [groupPhoneNumberTextFieldInput, setGroupPhoneNumberTextFieldInput] =
        useState(group?.phoneNumber ? group.phoneNumber : "")
    const [groupEmailTextFieldInput, setGroupEmailTextFieldInput] = useState(
        group?.email ? group.email : ""
    )
    const [groupNotesTextFieldInput, setGroupNotesTextFieldInput] = useState(
        group?.description ? group.description : ""
    )

    useEffect(() => {
        if (group) {
            const { address, phoneNumber, email, description } = group
            setGroupAddressTextFieldInput(address || "")
            setGroupPhoneNumberTextFieldInput(phoneNumber || "")
            setGroupEmailTextFieldInput(email || "")
            setGroupNotesTextFieldInput(description || "")
        }
    }, [group])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(
                    groupNameTextFieldInput,
                    groupAddressTextFieldInput,
                    groupPhoneNumberTextFieldInput,
                    groupEmailTextFieldInput,
                    groupNotesTextFieldInput
                )
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
                    fullWidth
                    required
                />
                <TextField
                    id="group-info-dialog-group-address-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupAddressTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    variant="filled"
                    value={groupAddressTextFieldInput}
                    onChange={(e) => {
                        setGroupAddressTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.addressOfCountry")}
                    fullWidth
                />
                <TextField
                    id="group-info-dialog-group-phone-number-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupPhoneNumberTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    variant="filled"
                    value={groupPhoneNumberTextFieldInput}
                    onChange={(e) => {
                        setGroupPhoneNumberTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.phoneNumberOfCountry")}
                    fullWidth
                    type="tel"
                />
                <TextField
                    id="group-info-dialog-group-email-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupEmailTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
                    variant="filled"
                    value={groupEmailTextFieldInput}
                    onChange={(e) => {
                        setGroupEmailTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.emailOfCountry")}
                    fullWidth
                    type="email"
                />
                <TextField
                    id="group-info-dialog-group-notes-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${groupNotesTextFieldInput.length}/${characterLimit}`}
                    className={classes.textFields}
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
                    fullWidth
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
                <DialogButton onClick={handleOnCancelClick}>
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
