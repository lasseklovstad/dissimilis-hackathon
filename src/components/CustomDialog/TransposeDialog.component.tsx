import React, { useState, useEffect } from "react"
import {
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        insertName: {
            marginBottom: theme.spacing(2),
        },
        formControl: {
            marginBottom: theme.spacing(2),
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
        <>
            <DialogTitle>{t("Dialog.transposeSong")}</DialogTitle>

            <DialogContent>
                <TextField
                    inputProps={{ maxLength: characterLimit }}
                    helperText={`${titleInput.length}/${characterLimit}`}
                    defaultValue={defaultValue}
                    className={classes.insertName}
                    autoFocus
                    value={titleInput}
                    variant="filled"
                    onChange={(e) => {
                        setTitleInput(e.target.value)
                    }}
                    label={t("Dialog.nameOfSong")}
                    style={{ width: "100%" }}
                />
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>{t("Dialog.semiNotes")}</InputLabel>
                    <Select
                        value={transposeInput}
                        onChange={(e) => {
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
            </DialogContent>
            <DialogActions>
                <DialogButton
                    disabled={!titleInput || !transposeInput}
                    onClick={() =>
                        handleOnSaveClick(titleInput, transposeInput)
                    }
                    variant="contained"
                >
                    {t("Dialog.save")}
                </DialogButton>
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setTitleInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </>
    )
}
