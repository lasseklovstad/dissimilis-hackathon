import React, { useState } from "react"
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material"

import { useTranslation } from "react-i18next"

export const LanguageDialog = (props: { onClose: () => void }) => {
    const { i18n, t } = useTranslation()
    const [languageChoice, setLanguageChoice] = useState(i18n.resolvedLanguage)
    const { onClose } = props

    const handleChangeLanguage = (language: string | null) => {
        if (language) {
            i18n.changeLanguage(language)
            localStorage.setItem("userLanguage", language)
            onClose()
        }
    }

    return (
        <>
            <DialogTitle>{t("MenuButton.changeLanguage")}</DialogTitle>

            <DialogContent>
                <FormControl
                    variant="filled"
                    margin={"normal"}
                    sx={{ minWidth: 150 }}
                >
                    <InputLabel id={"language-label"}>
                        {t("TopBar.languageSelect")}
                    </InputLabel>
                    <Select
                        value={languageChoice}
                        labelId={"language-label"}
                        label={t("TopBar.languageSelect")}
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

                <Button size="large" variant="outlined" onClick={onClose}>
                    {t("Dialog.cancel")}
                </Button>
            </DialogActions>
        </>
    )
}
