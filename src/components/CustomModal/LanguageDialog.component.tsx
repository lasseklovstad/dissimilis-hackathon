import React, { useState } from "react"
import {
    Button,
    Dialog,
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
import { colors } from "../../utils/colors"

const useStyles = makeStyles((theme) => {
    return {
        dialog: {
            boxShadow: "0 3px 6px 2px rgba(0, 0, 0, 0.1)",
            height: "auto",
            borderRadius: 2,
            padding: theme.spacing(4),
            "@media (max-width: 600px)": {
                width: "100%",
                padding: theme.spacing(1),
            },
            outline: "none",
        },
        button: {
            "&:hover": {
                backgroundColor: colors.gray_300,
            },
            marginRight: theme.spacing(1),
            float: "left",
            position: "relative",
        },
        title: {
            marginBottom: theme.spacing(1),
        },
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
        <Dialog
            open={props.dialogIsOpen}
            aria-label={t("TopBar.dialog")}
            onClose={() => props.handleClosed}
        >
            <div className={classes.dialog}>
                <DialogTitle className={classes.title}>
                    {t("MenuButton.changeLanguage")}
                </DialogTitle>

                <DialogContent>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <Select
                            value={`${languageChoice ? languageChoice : ""}`}
                            aria-label={t("TopBar.dropdownLabel")}
                            onChange={(
                                e: React.ChangeEvent<{ value: any }>
                            ) => {
                                setLanguageChoice(e.target.value)
                            }}
                        >
                            <MenuItem
                                aria-label={t("TopBar.languageNorwegian")}
                                value={"nb"}
                            >
                                {t("TopBar.languageNorwegian")}
                            </MenuItem>
                            <MenuItem
                                aria-label={t("TopBar.languageEnglish")}
                                value={"en"}
                            >
                                {t("TopBar.languageEnglish")}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Grid item>
                        <Button
                            className={classes.button}
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
                            className={classes.button}
                            size="large"
                            variant="outlined"
                            aria-label={t("Modal.cancel")}
                            onClick={() => {
                                handleOnCancelClick()
                            }}
                        >
                            {t("Modal.cancel")}
                        </Button>
                    </Grid>
                </DialogActions>
            </div>
        </Dialog>
    )
}
