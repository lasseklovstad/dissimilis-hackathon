import React, { useState } from "react"
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    makeStyles,
    MenuItem,
    Select,
} from "@material-ui/core"

import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) => {
    return {
        formControl: {
            marginBottom: theme.spacing(3),
            minWidth: 150,
        },
    }
})

export const LanguageDialog = (props: {
    handleOnSaveClick: (language: string | null) => void
    handleOnCancelClick: () => void
    handleClosed: () => void
    dialogIsOpen: boolean
    defaultValue?: string
}) => {
    const classes = useStyles()
    const userLanguage = localStorage.getItem("userLanguage")
    const [languageChoice, setLanguageChoice] = useState(userLanguage)
    const { t } = useTranslation()

    const { handleOnCancelClick, handleOnSaveClick } = props

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
                <Grid item>
                    <Button
                        size="large"
                        variant="contained"
                        aria-label={t("Modal.save")}
                        onClick={() => handleOnSaveClick(languageChoice)}
                    >
                        {t("Modal.save")}
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        size="large"
                        variant="outlined"
                        onClick={() => {
                            handleOnCancelClick()
                        }}
                    >
                        {t("Modal.cancel")}
                    </Button>
                </Grid>
            </DialogActions>
        </>
    )
}
