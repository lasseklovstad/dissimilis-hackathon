import React, { useState } from "react"
import { Dialog, IconButton, Menu, MenuItem } from "@material-ui/core"
import SettingsIcon from "@material-ui/icons/Settings"
import { useTranslation } from "react-i18next"
import { LanguageDialog } from "../CustomDialog/LanguageDialog.component"
import { useHistory } from "react-router"

export const DashboardMenu = (props: {}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [changeLanguageDialogIsOpen, setChangeLanguageDialogIsOpen] =
        useState(false)
    const { t } = useTranslation()
    const history = useHistory()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleOpenChangeLanguageDialog = () => {
        setChangeLanguageDialogIsOpen(true)
    }
    const handleCloseChangeLanguageDialog = () => {
        setChangeLanguageDialogIsOpen(false)
    }

    const handleClose = async (method?: "language" | "admin" | "profile") => {
        setAnchorEl(null)
        setChangeLanguageDialogIsOpen(false)
        switch (method) {
            case "language":
                handleOpenChangeLanguageDialog()
                break
            case "admin":
                history.push(`/admin`)
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
                <MenuItem onClick={() => handleClose("admin")}>
                    {t("AdminView.adminPanel")}
                </MenuItem>
            </Menu>
            <Dialog
                open={changeLanguageDialogIsOpen}
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
