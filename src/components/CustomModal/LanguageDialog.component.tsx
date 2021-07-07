import React, { useState } from "react"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    makeStyles,
    MenuItem,
    Select,
} from "@material-ui/core"

import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"
import i18n from "../../i18n"

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
        button: {
            "&:hover": {
                backgroundColor: colors.gray_300,
            },
            marginRight: "8px",
            float: "left",
            position: "relative",
        },
        title: {
            marginBottom: theme.spacing(1),
        },
        container: {
            width: "100%",
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

    console.log(i18n.language)
    const { handleOnCancelClick, handleOnSaveClick } = props

    return (
        <Dialog open={props.dialogIsOpen} onClose={() => props.handleClosed}>
            <div className={classes.dialog}>
                <DialogTitle className={classes.title}>
                    {t("MenuButton.changeLanguage")}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        {t("MenuButton.languageDescription")}
                    </DialogContentText>
                    <FormControl>
                        <Select
                            value={`${languageChoice ? languageChoice : ""}`}
                            onChange={(
                                e: React.ChangeEvent<{ value: any }>
                            ) => {
                                setLanguageChoice(e.target.value)
                            }}
                        >
                            <MenuItem value={"nb"}>No</MenuItem>
                            <MenuItem value={"en"}>En</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Grid item>
                        <Button
                            className={classes.button}
                            size="large"
                            variant="contained"
                            //disabled={!languageChoice}
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
