import React, { useEffect, useState } from "react"
import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    Grid,
    makeStyles,
    TextField,
} from "@material-ui/core"

import { useTranslation } from "react-i18next"
import { RadioButtons } from "../CustomModalComponents/RadioButtons.component"
import { DialogButton } from "../CustomModalComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        dialog: {
            boxShadow: "0 3px 6px 2px rgba(0, 0, 0, 0.1)",
            height: "auto",
            borderRadius: 2,
            padding: "20px",
            "@media (max-width: 600px)": {
                width: "80%",
                padding: "48px",
            },
            outline: "none",
        },
        insertName: {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(0.1),
        },
        title: {
            marginBottom: theme.spacing(1),
        },
        subtitle: {
            fontWeight: "bold",
            marginBottom: "5px",
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
    dialogOpen: boolean
    handleClosed: () => void
    saveText: string
    cancelText: string
    headerText: string
    labelText: string
    radioButtonLabel: string
    radioButtonOptions: string[]
    characterLimit?: number
    isLoading?: boolean
}) => {
    const {
        defaultValue,
        handleOnSaveClick,
        handleOnCancelClick,
        dialogOpen,
        handleClosed,
        saveText,
        cancelText,
        headerText,
        labelText,
        radioButtonLabel,
        radioButtonOptions,
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
        radioButtonOptions[0]
    )

    const handleChange = (event: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setRadioButtonValue(event.target.value)
    }

    return (
        <Dialog
            open={dialogOpen}
            onClose={() => handleClosed}
            aria-labelledby={t(headerText)}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 240,
            }}
        >
            <Fade in={dialogOpen}>
                <div className={classes.dialog}>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            handleOnSaveClick(textFieldInput, radioButtonValue)
                        }}
                    >
                        <DialogTitle className={classes.title}>
                            {" "}
                            {t(headerText)}{" "}
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                id="input-modal-textfield"
                                inputProps={{ maxLength: characterLimit }}
                                helperText={`${textFieldInput.length}/${characterLimit}`}
                                className={classes.insertName}
                                autoFocus
                                value={textFieldInput}
                                variant="filled"
                                onChange={(e) => {
                                    setTextFieldInput(e.target.value)
                                }}
                                label={labelText}
                                style={{ width: "100%" }}
                            />
                            <RadioButtons
                                radioButtonLabel={radioButtonLabel}
                                radioButtonOptions={radioButtonOptions}
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
                                            buttonText={saveText}
                                            isCancelButton={false}
                                        />
                                    </Grid>
                                )}
                                <Grid item>
                                    <DialogButton
                                        buttonText={cancelText}
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
                </div>
            </Fade>
        </Dialog>
    )
}
