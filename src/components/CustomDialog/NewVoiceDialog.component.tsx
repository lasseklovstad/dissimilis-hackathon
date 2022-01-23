import React, { useEffect, useState } from "react"
import { CircularProgress, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import { useTranslation } from "react-i18next"
import { RadioButtons } from "../CustomDialogComponents/RadioButtons.component"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        insertName: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
        loading: {
            margin: theme.spacing(1),
            marginRight: theme.spacing(2),
            justifyContent: "center",
            alignContent: "center",
            minWidth: "64px",
            maxWidth: "64px",
        },
    }
})

export const NewVoiceDialog = (props: {
    defaultValue?: string
    handleOnSaveClick: (value: string, option: string) => void
    handleOnCancelClick: () => void
    characterLimit?: number
    isLoading?: boolean
}) => {
    const {
        defaultValue,
        handleOnSaveClick,
        handleOnCancelClick,
        characterLimit = 250,
        isLoading,
    } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const [textFieldInput, setTextFieldInput] = useState("")

    useEffect(() => {
        if (defaultValue) {
            setTextFieldInput(defaultValue)
        }
    }, [defaultValue])

    const [radioButtonValue, setRadioButtonValue] = React.useState(
        "Dialog.duplicateFullVoice"
    )

    const handleChange = (event: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setRadioButtonValue(event.target.value)
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(textFieldInput, radioButtonValue)
            }}
        >
            <DialogTitle>{t("Dialog.addVoice")}</DialogTitle>
            <DialogContent>
                <TextField
                    id="input-dialog-textfield"
                    inputProps={{ maxLength: characterLimit }}
                    helperText={`${textFieldInput.length}/${characterLimit}`}
                    className={classes.insertName}
                    autoFocus
                    value={textFieldInput}
                    variant="filled"
                    onChange={(e) => {
                        setTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.nameOfVoice")}
                    style={{ width: "100%" }}
                />
                <RadioButtons
                    radioButtonLabel={t("Dialog.customNewVoice")}
                    radioButtonOptions={[
                        "Dialog.duplicateFullVoice",
                        "Dialog.duplicateEmptyVoice",
                        "Dialog.duplicateCustomVoice",
                    ]}
                    radioButtonValue={radioButtonValue}
                    handleChange={handleChange}
                />
            </DialogContent>

            <DialogActions>
                {isLoading ? (
                    <div className={classes.loading}>
                        <CircularProgress size={24} />
                    </div>
                ) : (
                    <DialogButton
                        disabled={!textFieldInput.trim()}
                        type="submit"
                        variant="contained"
                    >
                        {t("Dialog.create")}
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
