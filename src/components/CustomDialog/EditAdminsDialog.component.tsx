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
import { IOrganisation } from "../../models/IOrganisation"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import DeleteIcon from "@material-ui/icons/Delete"
import { IUser } from "../../models/IUser"
import { colors } from "../../utils/colors"
import AddIcon from "@material-ui/icons/Add"
import { ChoiceDialog } from "./ChoiceDialog.component"
import { UserAutoCompleteDialog } from "./UserAutoCompleteDialog.component"
import { IGroup } from "../../models/IGroup"

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

export const EditAdminsDialog = (props: {
    groupId?: number
    group?: IOrganisation | IGroup // Temporary
    editSysAdmins?: boolean
    handleOnCloseClick: () => void
}) => {
    const { groupId, group, handleOnCloseClick, editSysAdmins = false } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const secondary = true

    const [addAdminDialogIsOpen, setAddAdminDialogIsOpen] = useState(false)
    const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
        useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<IUser>()

    const getAdmins = () => {
        if (group !== undefined && !editSysAdmins) {
            return group.admins
        }
        if (editSysAdmins) {
            return [] //RETURNER SYSTEMADMINS
        }
        return []
    }

    const handleDeleteAdmin = /* async */ () => {
        if (getAdmins().length > 1) {
            if (selectedAdmin) {
                console.log(
                    "Should now delete " + selectedAdmin.name + " from admins"
                )
            }
            setConfirmationDialogIsOpen(false)
        } else {
            console.log("There must be at least one admin in a group!")
        }
    }

    const handleAddAdmin = /* async */ (user: IUser | undefined) => {
        //console.log("Should now add " + email + " as admin in " + group.name)
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
                    {t("Dialog.adminsIn")}{" "}
                    {group !== undefined
                        ? group.organisationName
                        : t("AdminView.system")}
                    :
                </Typography>
                <List dense={false}>
                    {getAdmins().map((admin) => {
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
                                        {t("AdminView.addUser")}
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
                    userList={[]}
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
