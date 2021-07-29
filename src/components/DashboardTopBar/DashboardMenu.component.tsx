import React, { useState } from "react"
import {
    Dialog,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
} from "@material-ui/core"
import SettingsIcon from "@material-ui/icons/Settings"
import { useTranslation } from "react-i18next"
import { LanguageDialog } from "../CustomDialog/LanguageDialog.component"
import { useLogout } from "../../utils/useApiServiceUsers"
import { ReactComponent as LogoutIcon } from "../../assets/images/LogoutIcon.svg"
import LanguageIcon from "@material-ui/icons/Language"
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { Loading } from "../loading/Loading.component"
import { useHistory } from "react-router"
import { useGetAdminStatuses } from "../../utils/useApiServiceUsers"

const useStyles = makeStyles({
    menuItem: {
        display: "flex",
        justifyContent: "space-between",
    },
})

export const DashboardMenu = (props: {}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [changeLanguageDialogIsOpen, setChangeLanguageDialogIsOpen] =
        useState(false)
    const { t } = useTranslation()
    const classes = useStyles()
    const { logout } = useLogout()
    const history = useHistory()
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
                history.push("/admin")
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
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => handleClose("language")}
                >
                    {t("MenuButton.changeLanguage")}
                    <LanguageIcon style={{ marginLeft: "2vh" }} />
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
                onClose={() => handleCloseChangeLanguageDialog}
            >
                <LanguageDialog
                    handleOnCancelClick={handleClose}
                    handleClosed={() => setChangeLanguageDialogIsOpen(false)}
                    dialogIsOpen={changeLanguageDialogIsOpen}
                />
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
