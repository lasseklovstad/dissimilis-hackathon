import React, { useEffect, useState } from "react"
import {
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
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import DeleteIcon from "@material-ui/icons/Delete"
import { IUser } from "../../models/IUser"
import { colors } from "../../utils/colors"
import { ChoiceDialog } from "./ChoiceDialog.component"
import { useGetUsers } from "../../utils/useApiServiceUsers"

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

export const EditSystemMembersDialog = (props: {
    handleOnCloseClick: () => void
}) => {
    const { handleOnCloseClick } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const secondary = true

    const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
        useState(false)
    const [selectedMember, setSelectedMember] = useState<IUser>()
    const [members, setMembers] = useState<IUser[]>()

    const { getUsers, users } = useGetUsers()

    useEffect(() => {
        if (users) {
            setMembers(users)
        }
    }, [users])

    const handleOpenConfirmationDialog = () => {
        setConfirmationDialogIsOpen(true)
    }

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogIsOpen(false)
    }

    const handleRemoveMember = () => {
        // do stuff with selectedMember
    }

    const getMembers = () => {
        if (!getUsers.loading) {
            return (
                <>
                    {members ? (
                        <List dense={false}>
                            {members.map((user: IUser) => {
                                return (
                                    <ListItem key={user.email + "-list-item"}>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={
                                                secondary ? user.email : null
                                            }
                                            className={classes.iconButton}
                                            secondaryTypographyProps={{
                                                className:
                                                    classes.secondaryTypography,
                                            }}
                                        />
                                        <ListItemSecondaryAction
                                            onClick={() => {
                                                setSelectedMember(user)
                                                handleOpenConfirmationDialog()
                                            }}
                                        >
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>
                    ) : (
                        ""
                    )}
                </>
            )
        }
        return undefined
    }

    return (
        <>
            <DialogTitle>{t("Dialog.usersInSystem")}</DialogTitle>
            <DialogContent>{getMembers()}</DialogContent>
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
                open={confirmationDialogIsOpen}
                onClose={handleCloseConfirmationDialog}
                aria-label={t("Dialog.removeUser")}
            >
                <ChoiceDialog
                    handleOnCancelClick={handleCloseConfirmationDialog}
                    handleOnSaveClick={handleRemoveMember}
                    ackText={t("Dialog.removeUser")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("Dialog.removeUser")}
                    descriptionText={
                        t("Dialog.removeUserDescription") +
                        " " +
                        (selectedMember?.name || t("Dialog.thisUser")) +
                        " " +
                        t("Dialog.fromTheSystem") +
                        " " + // <== Would have been nice with line break right here but I cannot find a way to do it...
                        t("Dialog.cannotUndo")
                    }
                />
            </Dialog>
        </>
    )
}
