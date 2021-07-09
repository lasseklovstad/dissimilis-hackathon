import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    TextField,
} from "@material-ui/core"

import { useTranslation } from "react-i18next"
import { RadioButtons } from "../CustomDialogComponents/RadioButtons.component"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        insertName: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
        container: {
            width: "100%",
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
        "Dialog.duplicateFullSong"
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
                        "Dialog.duplicateFullSong",
                        "Dialog.duplicateEmptySong",
                        "Dialog.duplicateCustomSong",
                    ]}
                    radioButtonValue={radioButtonValue}
                    handleChange={handleChange}
                />
            </DialogContent>

            <DialogActions>
                <Grid container>
                    {isLoading ? (
                        <Grid container className={classes.loading}>
                            <CircularProgress size={24} />
                        </Grid>
                    ) : (
                        <Grid item>
                            <DialogButton
                                disabled={!textFieldInput.trim()}
                                buttonText={t("Dialog.create")}
                                isCancelButton={false}
                            />
                        </Grid>
                    )}
                    <Grid item>
                        <DialogButton
                            buttonText={t("Dialog.cancel")}
                            onClick={() => {
                                handleOnCancelClick()
                                setTextFieldInput("")
                            }}
                            isCancelButton
                        />
                    </Grid>
                </Grid>
            </DialogActions>
        </form>
    )
}
