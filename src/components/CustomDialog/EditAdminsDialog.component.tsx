import React, { useEffect, useState } from "react"
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
import {
    useGetGroupOrOrganisationMembers,
    UserRole,
    useSetUserRoleInGroup,
    useSetUserRoleInOrganisation,
} from "../../utils/useApiServiceGroups"
import { useSnackbarContext } from "../../utils/snackbarContextProvider.component"

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
    groupId: number
    group?: IOrganisation | IGroup
    isGroup: boolean
    handleOnCloseClick: () => void
    handleAddAdminInGroupObject: (user: IUser) => void
    handleRemoveAdminFromGroupObject: (userId: number) => void
}) => {
    const {
        groupId,
        group,
        handleOnCloseClick,
        isGroup,
        handleAddAdminInGroupObject,
        handleRemoveAdminFromGroupObject,
    } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const secondary = true

    const { setUserRoleInGroup } = useSetUserRoleInGroup(groupId || 0)
    const { setUserRoleInOrganisation } = useSetUserRoleInOrganisation(
        groupId || 0
    )
    const { groupMembers } = useGetGroupOrOrganisationMembers(isGroup, groupId)

    const [addAdminDialogIsOpen, setAddAdminDialogIsOpen] = useState(false)
    const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
        useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<IUser>()

    const [adminList, setAdminsList] = useState<IUser[]>(group?.admins || [])
    const [userList, setUserList] = useState<IUser[] | undefined>()

    const { launchSnackbar } = useSnackbarContext()

    useEffect(() => {
        if (groupMembers) {
            setUserList(groupMembers)
        }
    }, [groupMembers])

    const handleUpdateRole = async (role: UserRole, user: IUser) => {
        const { error } = await (isGroup
            ? setUserRoleInGroup
            : setUserRoleInOrganisation
        ).run(
            {
                roleToSet: role,
            },
            user.userId.toString() + "/changeUserRole"
        )
        return !!error
    }

    const handleRemoveAdmin = async () => {
        if (adminList.length > 1) {
            if (selectedAdmin) {
                const isError = await handleUpdateRole(
                    UserRole.Member,
                    selectedAdmin
                )
                if (!isError && selectedAdmin) {
                    setAdminsList(
                        adminList.filter(
                            (user) => user.userId !== selectedAdmin.userId
                        )
                    )
                    handleRemoveAdminFromGroupObject(selectedAdmin.userId)
                    setConfirmationDialogIsOpen(false)
                } else {
                    launchSnackbar(t("Snackbar.removeAdmin"), true)
                }
            }
            return false
        } else {
            launchSnackbar(t("Snackbar.oneAdminLeft"), true)
            return false
        }
    }

    const handleAddAdmin = async (user: IUser | undefined) => {
        if (user) {
            const isError = await handleUpdateRole(UserRole.Admin, user)
            if (!isError && user) {
                setAdminsList([...adminList, user])
                handleAddAdminInGroupObject(user)
                setAddAdminDialogIsOpen(false)
            } else {
                launchSnackbar(t("Snackbar.addAdmin"), true)
            }
        }
    }

    const filterAdmins = () =>
        userList?.filter(
            (user) => !adminList.some((admin) => admin.userId === user.userId)
        ) || []

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
                    {t("Dialog.adminsIn")}{" "}
                    {group
                        ? "groupName" in group
                            ? group.groupName
                            : group.organisationName
                        : ""}
                    :
                </Typography>
                <List dense={false}>
                    {adminList.map((admin) => (
                        <ListItem key={`${admin.email}-list-item`}>
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
                    ))}
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
                                        {t("AdminView.addUser")}
                                    </div>
                                </Button>
                            }
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <DialogButton onClick={handleOnCloseClick}>
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
                    handleOnSaveClick={handleRemoveAdmin}
                    ackText={t("Dialog.removeAdmin")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("Dialog.removeAdmin")}
                    descriptionText={`
                        ${t("Dialog.removeAdminDescription")} 
                        ${selectedAdmin?.name || t("Dialog.thisUser")} 
                        ${t("Dialog.asAdmin")} 
                        ${t("Dialog.cannotUndo")}
                    `}
                />
            </Dialog>
        </>
    )
}
