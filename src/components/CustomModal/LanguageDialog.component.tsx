import React, { useState } from "react"
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    makeStyles,
    MenuItem,
    Select,
} from "@material-ui/core"

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

export const LanguageDialog = (props: {
    handleOnCancelClick: () => void
    handleClosed: () => void
    dialogIsOpen: boolean
    defaultValue?: string
}) => {
    const classes = useStyles()
    const userLanguage = localStorage.getItem("userLanguage")
    const [languageChoice, setLanguageChoice] = useState(userLanguage)
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
                        value={`${languageChoice ? languageChoice : ""}`}
                        inputProps={{
                            "aria-label": t("TopBar.languageSelect"),
                        }}
                        onChange={(e: React.ChangeEvent<{ value: any }>) => {
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
                    {t("Modal.save")}
                </Button>

                <Button
                    size="large"
                    variant="outlined"
                    onClick={() => {
                        handleOnCancelClick()
                    }}
                >
                    {t("Modal.cancel")}
                </Button>
            </DialogActions>
        </>
    )
}
