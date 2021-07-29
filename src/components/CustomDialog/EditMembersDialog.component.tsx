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
    Typography,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import DeleteIcon from "@material-ui/icons/Delete"
import { IUser } from "../../models/IUser"
import { colors } from "../../utils/colors"
import { ChoiceDialog } from "./ChoiceDialog.component"
import {
    useGetGroupOrOrganisationMembers,
    useRemoveGroupMember,
    useRemoveOrganisationMember,
} from "../../utils/useApiServiceGroups"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"

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

export const EditMembersDialog = (props: {
    groupId: number
    groupName: string
    isGroup: boolean
    handleOnCloseClick: () => void
}) => {
    const { groupId, isGroup, groupName, handleOnCloseClick } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const secondary = true

    const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
        useState(false)
    const [selectedMember, setSelectedMember] = useState<IUser>()
    const [members, setMembers] = useState<IUser[]>()

    const { getGroupMembers, groupMembers } = useGetGroupOrOrganisationMembers(
        isGroup,
        groupId
    )

    const { removeGroupMember } = useRemoveGroupMember(groupId)
    const { removeOrganisationMember } = useRemoveOrganisationMember(groupId)

    useEffect(() => {
        if (groupMembers) {
            setMembers(groupMembers)
        }
    }, [groupMembers])

    const handleOpenConfirmationDialog = () => {
        setConfirmationDialogIsOpen(true)
    }

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogIsOpen(false)
    }

    const handleRemoveMember = async () => {
        let error
        if (isGroup) {
            const result = await removeGroupMember.run(
                `/${selectedMember?.userId}`
            )
            error = result.error
        } else {
            const result = await removeOrganisationMember.run(
                `/${selectedMember?.userId}`
            )
            error = result.error
        }
        if (!error) {
            setMembers(
                members?.filter(
                    (user) => user.userId !== selectedMember?.userId
                )
            )
            handleCloseConfirmationDialog()
        } else {
            // Snackbar
        }
    }

    const getMembers = () => {
        if (!getGroupMembers.loading) {
            return (
                <>
                    {members ? (
                        <List dense={false}>
                            {members.map((user: IUser) => (
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
                            ))}
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
            <DialogTitle>{t("Dialog.editGroupMembers")}</DialogTitle>
            <DialogContent>
                <Typography variant="caption">
                    {t("Dialog.membersIn") + " "}
                    {groupName}:
                </Typography>
                {getMembers()}
            </DialogContent>
            <DialogActions>
                <DialogButton onClick={handleOnCloseClick}>
                    {t("Dialog.close")}
                </DialogButton>
            </DialogActions>
            <Dialog
                open={confirmationDialogIsOpen}
                onClose={handleCloseConfirmationDialog}
                aria-label={t("Dialog.removeMember")}
            >
                <ChoiceDialog
                    handleOnCancelClick={handleCloseConfirmationDialog}
                    handleOnSaveClick={handleRemoveMember}
                    ackText={t("Dialog.removeMember")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("Dialog.removeMember")}
                    descriptionText={`
                        ${t("Dialog.removeAdminDescription")}
                        ${selectedMember?.name || t("Dialog.thisUser")}
                        ${t("Dialog.asMember")}
                        ${t("Dialog.cannotUndo")}
                    `}
                />
            </Dialog>
            <ErrorDialog
                error={
                    isGroup
                        ? removeGroupMember.error
                        : removeOrganisationMember.error
                }
                isError={
                    removeGroupMember.isError ||
                    removeOrganisationMember.isError
                }
                title={`
                    ${t("Dialog.cannotRemoveUserFrom")}
                    ${
                        isGroup
                            ? t("Dialog.theGroup")
                            : t("Dialog.theOrganisation")
                    }
                    ${t("Dialog.errorOrLastAdmin")}
                    ${
                        isGroup
                            ? t("Dialog.theGroup")
                            : t("Dialog.theOrganisation")
                    }
                `}
            />
        </>
    )
}
