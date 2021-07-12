import React, { useState } from "react"
import { Dialog, IconButton, Menu, MenuItem } from "@material-ui/core"
import SettingsIcon from "@material-ui/icons/Settings"
import { useTranslation } from "react-i18next"
import { LanguageDialog } from "../CustomModal/LanguageDialog.component"
import i18n from "../../i18n"

export const DashboardMenu = (props: {}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [changeLanguageDialogIsOpen, setChangeLanguageDialogIsOpen] =
        useState(false)
    const { t } = useTranslation()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleOpenChangeLanguageDialog = async () => {
        setChangeLanguageDialogIsOpen(true)
    }
    const handleCloseChangeLanguageDialog = async () => {
        setChangeLanguageDialogIsOpen(false)
    }

    const handleChangeLanguage = async (language: string | null) => {
        if (language) {
            i18n.changeLanguage(language)
            localStorage.setItem("userLanguage", language)
            setChangeLanguageDialogIsOpen(false)
        }
    }

    const handleClose = async (method?: "language" | "profile") => {
        setAnchorEl(null)
        setChangeLanguageDialogIsOpen(false)
        switch (method) {
            case "language":
                handleOpenChangeLanguageDialog()
                break
            default:
                break
        }
    }

    return (
        <>
            <IconButton
                aria-haspopup="true"
                aria-label={t("TopBar.settings")}
                onClick={handleClick}
            >
                <SettingsIcon />
            </IconButton>
            <Menu
                id="dashboardMenu"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={() => handleClose()}
                role="menu"
            >
                <MenuItem onClick={() => handleClose("language")}>
                    {t("MenuButton.changeLanguage")}
                </MenuItem>
            </Menu>
            <Dialog
                open={changeLanguageDialogIsOpen}
                aria-label={t("TopBar.dialog")}
                onClose={() => handleCloseChangeLanguageDialog}
            >
                <LanguageDialog
                    handleOnSaveClick={handleChangeLanguage}
                    handleOnCancelClick={handleClose}
                    handleClosed={() => setChangeLanguageDialogIsOpen(false)}
                    dialogIsOpen={changeLanguageDialogIsOpen}
                />
            </Dialog>
        </>
    )
}
