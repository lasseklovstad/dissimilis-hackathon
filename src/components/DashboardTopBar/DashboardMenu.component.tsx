import React, { useState } from "react"
import { Dialog, IconButton, Menu, MenuItem } from "@material-ui/core"
import SettingsIcon from "@material-ui/icons/Settings"
import { useTranslation } from "react-i18next"
import { LanguageDialog } from "../CustomModal/LanguageDialog.component"

export const DashboardMenu = (props: {}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [changeLanguageDialogIsOpen, setChangeLanguageDialogIsOpen] =
        useState(false)
    const { t } = useTranslation()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleOpenChangeLanguageDialog = () => {
        setChangeLanguageDialogIsOpen(true)
    }
    const handleCloseChangeLanguageDialog = () => {
        setChangeLanguageDialogIsOpen(false)
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
                aria-controls="dashboardMenu"
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
                    handleOnCancelClick={handleClose}
                    handleClosed={() => setChangeLanguageDialogIsOpen(false)}
                    dialogIsOpen={changeLanguageDialogIsOpen}
                />
            </Dialog>
        </>
    )
}
