import React, { useState, useEffect } from "react"
import {
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core"

import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomModalComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        insertName: {
            marginBottom: theme.spacing(3),
        },
        title: {
            marginBottom: theme.spacing(2),
        },
        formControl: {
            marginBottom: theme.spacing(4),
            minWidth: 120,
        },
    }
})

const characterLimit = 250

export const TransposeDialog = (props: {
    defaultValue?: string
    handleOnCancelClick: () => void
    handleOnSaveClick: (title: string, transpose: string) => void
}) => {
    const classes = useStyles()
    const [titleInput, setTitleInput] = useState("")
    const [transposeInput, setTransposeInput] = useState("")
    const { t } = useTranslation()

    const { defaultValue, handleOnCancelClick, handleOnSaveClick } = props

    useEffect(() => {
        if (defaultValue) {
            setTitleInput(defaultValue)
        }
    }, [defaultValue])

    return (
        <DialogContent>
            <Grid container>
                <Typography className={classes.title} variant="h2">
                    {t("Modal.transposeSong")}
                </Typography>
                <Grid item className={classes.insertName} xs={12}>
                    <TextField
                        inputProps={{ maxLength: characterLimit }}
                        helperText={`${titleInput.length}/${characterLimit}`}
                        defaultValue={defaultValue}
                        autoFocus
                        value={titleInput}
                        variant="filled"
                        onChange={(e) => {
                            setTitleInput(e.target.value)
                        }}
                        label={t("Modal.nameOfSong")}
                        style={{ width: "100%" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel>{t("Modal.semiNotes")}</InputLabel>
                        <Select
                            value={transposeInput}
                            onChange={(
                                e: React.ChangeEvent<{ value: any }>
                            ) => {
                                setTransposeInput(e.target.value)
                            }}
                            label="semiNotes"
                        >
                            <MenuItem value={-6}>-6</MenuItem>
                            <MenuItem value={-5}>-5</MenuItem>
                            <MenuItem value={-4}>-4</MenuItem>
                            <MenuItem value={-3}>-3</MenuItem>
                            <MenuItem value={-2}>-2</MenuItem>
                            <MenuItem value={-1}>-1</MenuItem>
                            <MenuItem value={0}>0</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <DialogButton
                        disabled={!titleInput || !transposeInput}
                        buttonText={t("Modal.save")}
                        onClick={() =>
                            handleOnSaveClick(titleInput, transposeInput)
                        }
                        isCancelButton={false}
                    />
                    <DialogButton
                        buttonText={t("Modal.cancel")}
                        onClick={() => {
                            handleOnCancelClick()
                            setTitleInput("")
                        }}
                        isCancelButton
                    />
                </Grid>
            </Grid>
        </DialogContent>
    )
}
