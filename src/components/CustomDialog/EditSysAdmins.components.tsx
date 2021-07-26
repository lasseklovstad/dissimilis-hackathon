import React, { useState } from "react"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import DeleteIcon from "@material-ui/icons/Delete"
import { IUser } from "../../models/IUser"
import { colors } from "../../utils/colors"
import AddIcon from "@material-ui/icons/Add"
import { ChoiceDialog } from "./ChoiceDialog.component"
import { UserAutoCompleteDialog } from "./UserAutoCompleteDialog.component"
import { UserRole } from "../../utils/useApiServiceGroups"

const useStyles = makeStyles((theme) => {
    return {
        iconButton: {
            marginRight: theme.spacing(5),
        },
        secondaryTypography: {
            marginTop: theme.spacing(0.5),
        },
        button: {
            backgroundColor: colors.white,
            width: "100%",
            height: "100%",
            justifyContent: "left",
            fontSize: "1rem",
            padding: "0px",
            "&:hover": {
                backgroundColor: colors.white,
            },
        },
        buttonText: {
            paddingLeft: "8px",
        },
    }
})

export const EditSysAdminsDialog = (props: {
    handleOnCloseClick: () => void
}) => {
    const { handleOnCloseClick } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const secondary = true

    const [addAdminDialogIsOpen, setAddAdminDialogIsOpen] = useState(false)
    const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
        useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<IUser>()

    const [adminList, setAdminsList] = useState<IUser[]>([])
    const [userList, setUserList] = useState<IUser[]>()

    const handleUpdateRole = async (role: UserRole) => {
        if (adminList.length > 1) {
            if (selectedAdmin) {
                /*const { error } = await (
                ).run(
                    {
                        userRole: UserRole.Member,
                    },
                    selectedAdmin.userId.toString()
                )
                return !!error*/
            }
            return false
        } else {
            console.log("There must be at least one admin in a group!")
            // Snackbar
            return false
        }
    }

    const handleDeleteAdmin = async () => {
        const isError = await handleUpdateRole(UserRole.Member)
        if (!isError && selectedAdmin) {
            setAdminsList(
                adminList.filter((user) => user.userId !== selectedAdmin.userId)
            )
            setConfirmationDialogIsOpen(false)
        } else {
            // An error occured
            // Snackbar
        }
    }

    const handleAddAdmin = async (user: IUser | undefined) => {
        const isError = await handleUpdateRole(UserRole.Admin)
        if (!isError && selectedAdmin) {
            setAdminsList([...adminList, selectedAdmin])
            setAddAdminDialogIsOpen(false)
        } else {
            // An error occured
            // Snackbar
        }
    }

    const filterAdmins = () => {
        return (
            userList?.filter(
                (user) =>
                    !adminList.some((admin) => admin.userId === user.userId)
            ) || []
        )
    }

    const handleCloseAddAdminDialog = () => {
        setAddAdminDialogIsOpen(false)
    }

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogIsOpen(false)
    }

    return (
        <>
            <DialogTitle>{t("Dialog.editAdmins")}</DialogTitle>
            <DialogContent>
                <Typography variant="caption">
                    {t("Dialog.adminsIn")} {t("AdminView.system")}
                </Typography>
                <List dense={false}>
                    {adminList.map((admin) => {
                        return (
                            <ListItem key={admin.email + "-list-item"}>
                                <ListItemText
                                    primary={admin.name}
                                    secondary={secondary ? admin.email : null}
                                    className={classes.iconButton}
                                    secondaryTypographyProps={{
                                        className: classes.secondaryTypography,
                                    }}
                                />
                                <ListItemSecondaryAction
                                    onClick={() => {
                                        setSelectedAdmin(admin)
                                        setConfirmationDialogIsOpen(true)
                                    }}
                                >
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })}
                    <ListItem>
                        <ListItemText
                            primary={
                                <Button
                                    disableFocusRipple
                                    className={classes.button}
                                    onClick={() =>
                                        setAddAdminDialogIsOpen(true)
                                    }
                                >
                                    <AddIcon />
                                    <div className={classes.buttonText}>
                                        {t("AdminView.inviteUser")}
                                    </div>
                                </Button>
                            }
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <DialogButton
                    onClick={() => {
                        handleOnCloseClick()
                    }}
                >
                    {t("Dialog.close")}
                </DialogButton>
            </DialogActions>
            <Dialog
                open={addAdminDialogIsOpen}
                onClose={handleCloseAddAdminDialog}
                aria-label={t("Dialog.addAdmin")}
                maxWidth="xs"
                fullWidth
            >
                <UserAutoCompleteDialog
                    handleOnCancelClick={handleCloseAddAdminDialog}
                    handleOnSaveClick={handleAddAdmin}
                    saveText={t("Dialog.add")}
                    title={t("Dialog.addAdmin")}
                    descriptionText={t("Dialog.emailOfNewAdmin")}
                    userList={filterAdmins()}
                />
            </Dialog>
            <Dialog
                open={confirmationDialogIsOpen}
                onClose={handleCloseConfirmationDialog}
                aria-label={t("Dialog.addAdmin")}
            >
                <ChoiceDialog
                    handleOnCancelClick={handleCloseConfirmationDialog}
                    handleOnSaveClick={handleDeleteAdmin}
                    ackText={t("Dialog.removeAdmin")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("Dialog.removeAdmin")}
                    descriptionText={
                        t("Dialog.removeAdminDescription") +
                        " " +
                        (selectedAdmin?.name || t("Dialog.thisUser")) +
                        " " +
                        t("Dialog.asAdmin") +
                        " " + // <== Would have been nice with line break right here but I cannot find a way to do it...
                        t("Dialog.cannotUndo")
                    }
                />
            </Dialog>
        </>
    )
}
