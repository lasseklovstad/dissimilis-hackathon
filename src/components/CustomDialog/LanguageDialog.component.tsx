import React, { useState } from "react"
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import { useTranslation } from "react-i18next"
import i18n from "../../i18n"

const useStyles = makeStyles((theme) => {
    return {
        formControl: {
            marginBottom: theme.spacing(3),
            minWidth: 150,
        },
    }
})

const supportedLanguages = ["en", "no"]

const getLanguage = () => {
    const userLanguage = localStorage.getItem("userLanguage")
    if (userLanguage && supportedLanguages.includes(userLanguage)) {
        return userLanguage
    }
    return ""
}

export const LanguageDialog = (props: {
    handleOnCancelClick: () => void
    handleClosed: () => void
    dialogIsOpen: boolean
    defaultValue?: string
}) => {
    const classes = useStyles()
    const [languageChoice, setLanguageChoice] = useState(getLanguage())
    const { t } = useTranslation()
    const { handleOnCancelClick } = props

    const handleChangeLanguage = (language: string | null) => {
        if (language) {
            i18n.changeLanguage(language)
            localStorage.setItem("userLanguage", language)
            handleOnCancelClick()
        }
    }

    return (
        <>
            <DialogTitle>{t("MenuButton.changeLanguage")}</DialogTitle>

            <DialogContent>
                <FormControl variant="outlined" className={classes.formControl}>
                    <Select
                        value={languageChoice}
                        inputProps={{
                            "aria-label": t("TopBar.languageSelect"),
                        }}
                        onChange={(e) => {
                            setLanguageChoice(e.target.value)
                        }}
                    >
                        <MenuItem value={"no"}>
                            {t("TopBar.languageNorwegian")}
                        </MenuItem>
                        <MenuItem value={"en"}>
                            {t("TopBar.languageEnglish")}
                        </MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => handleChangeLanguage(languageChoice)}
                >
                    {t("Dialog.save")}
                </Button>

                <Button
                    size="large"
                    variant="outlined"
                    onClick={() => {
                        handleOnCancelClick()
                    }}
                >
                    {t("Dialog.cancel")}
                </Button>
            </DialogActions>
        </>
    )
}
