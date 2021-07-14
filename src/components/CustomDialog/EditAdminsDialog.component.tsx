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
import { ICountry } from "../../models/ICountry"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import DeleteIcon from "@material-ui/icons/Delete"
import { IUser } from "../../models/IUser"
import { InputDialog } from "./InputDialog.component"
import { colors } from "../../utils/colors"
import AddIcon from "@material-ui/icons/Add"
import { ChoiceDialog } from "./ChoiceDialog.component"

const useStyles = makeStyles((theme) => {
    return {
        textFields: {
            marginBottom: theme.spacing(0.5),
        },
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

export const EditAdminsDialog = (props: {
    groupId: number
    group: ICountry // Temporary
    handleOnCloseClick: () => void
}) => {
    const { groupId, group, handleOnCloseClick } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const secondary = true
    const [addAdminDialogIsOpen, setAddAdminDialogIsOpen] = useState(false)
    const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
        useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<IUser>()

    const handleDeleteAdmin = /* async */ () => {
        if (group.admins.length > 1) {
            if (selectedAdmin) {
                console.log(
                    "Should now delete " +
                        selectedAdmin.name +
                        " from admins in " +
                        group.name
                )
            }
            setConfirmationDialogIsOpen(false)
        } else {
            console.log("There must be at least one admin in a group!")
        }
    }

    const handleAddAdmin = /* async */ (email: string) => {
        console.log("Should now add " + email + " as admin in " + group.name)
        setAddAdminDialogIsOpen(false)
    }

    const handleOpenAddAdminDialog = () => {
        setAddAdminDialogIsOpen(true)
    }

    const handleCloseAddAdminDialog = () => {
        setAddAdminDialogIsOpen(false)
    }

    const handleOpenConfirmationDialog = () => {
        setConfirmationDialogIsOpen(true)
    }

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogIsOpen(false)
    }

    return (
        <>
            <DialogTitle>{t("Dialog.editAdmins")}</DialogTitle>
            <DialogContent>
                <Typography variant="caption">
                    {t("Dialog.adminsIn")} {group.name}:
                </Typography>
                <List dense={false}>
                    {group.admins.map((admin) => {
                        return (
                            <ListItem>
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
                                        handleOpenConfirmationDialog()
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
                                    onClick={handleOpenAddAdminDialog}
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
            >
                <InputDialog
                    handleOnCancelClick={handleCloseAddAdminDialog}
                    handleOnSaveClick={handleAddAdmin}
                    saveText={t("Dialog.add")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("Dialog.addAdmin")}
                    labelText={t("Dialog.emailOfNewAdmin")}
                    isLoading={false}
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
