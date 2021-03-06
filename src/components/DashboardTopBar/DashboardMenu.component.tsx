import React, { useState } from "react"
import { Dialog, IconButton, Menu, MenuItem } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import SettingsIcon from "@mui/icons-material/Settings"
import { useTranslation } from "react-i18next"
import { LanguageDialog } from "../CustomDialog/LanguageDialog/LanguageDialog.component"
import { useLogout } from "../../utils/useApiServiceUsers"
import { ReactComponent as LogoutIcon } from "../../assets/images/LogoutIcon.svg"
import LanguageIcon from "@mui/icons-material/Language"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { Loading } from "../loading/Loading.component"
import { useNavigate } from "react-router-dom"
import { useGetAdminStatuses } from "../../utils/useApiServiceUsers"

const useStyles = makeStyles({
    menuContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    menuItem: {
        display: "flex",
        justifyContent: "space-between",
    },
    menuIcon: {
        marginLeft: "2vh",
    },
})

export const DashboardMenu = (props: {}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [changeLanguageDialogIsOpen, setChangeLanguageDialogIsOpen] =
        useState(false)
    const { t } = useTranslation()
    const classes = useStyles()
    const { logout } = useLogout()
    const navigate = useNavigate()
    const { adminStatuses } = useGetAdminStatuses()

    const userIsAnyAdmin = () =>
        adminStatuses?.systemAdmin ||
        adminStatuses?.organisationAdmin ||
        adminStatuses?.groupAdmin

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleOpenChangeLanguageDialog = () => {
        setChangeLanguageDialogIsOpen(true)
    }
    const handleCloseChangeLanguageDialog = () => {
        setChangeLanguageDialogIsOpen(false)
    }

    const handleClose = async (method?: "language" | "admin" | "logout") => {
        setAnchorEl(null)
        setChangeLanguageDialogIsOpen(false)
        switch (method) {
            case "language":
                handleOpenChangeLanguageDialog()
                break
            case "logout":
                logout.run()
                break
            case "admin":
                navigate("/admin")
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
                size="large"
            >
                <SettingsIcon />
            </IconButton>
            <Menu
                id="dashboardMenu"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={() => handleClose()}
                className={classes.menuContainer}
            >
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => handleClose("language")}
                >
                    {t("MenuButton.changeLanguage")}
                    <LanguageIcon className={classes.menuIcon} />
                </MenuItem>
                {userIsAnyAdmin() && (
                    <MenuItem
                        className={classes.menuItem}
                        onClick={() => handleClose("admin")}
                    >
                        {t("AdminView.adminPanel")}
                        <AssignmentIndIcon />
                    </MenuItem>
                )}
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => handleClose("logout")}
                >
                    {t("LoginView.logout")}
                    <LogoutIcon />
                </MenuItem>
            </Menu>
            <Dialog
                open={changeLanguageDialogIsOpen}
                onClose={handleCloseChangeLanguageDialog}
            >
                <LanguageDialog onClose={handleCloseChangeLanguageDialog} />
            </Dialog>
            <Loading isLoading={logout.loading} fullScreen />
            <ErrorDialog
                isError={logout.isError}
                error={logout.error}
                title={t("LoginView.logoutError")}
            />
        </>
    )
}
