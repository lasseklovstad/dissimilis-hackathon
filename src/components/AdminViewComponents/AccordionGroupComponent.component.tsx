import React, { useEffect, useState } from "react"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    Grid,
    Typography,
} from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { colors } from "../../utils/colors"
import { useTranslation } from "react-i18next"
import { IUser } from "../../models/IUser"
import { EditAdminsDialog } from "../CustomDialog/EditAdminsDialog.component"
import { EditGroupInfoDialog } from "../CustomDialog/EditGroupInfoDialog.component"
import {
    useAddGroupMember,
    useDeleteGroup,
    useGetGroup,
    UserRole,
    useUpdateGroup,
} from "../../utils/useApiServiceGroups"
import { ChoiceDialog } from "../CustomDialog/ChoiceDialog.component"
import { EditMembersDialog } from "../CustomDialog/EditMembersDialog.component"
import { AddGroupMemberDialog } from "../CustomDialog/AddGroupMemberDialog.component"
import { IGroup } from "../../models/IGroup"
import { useSnackbarContext } from "../../utils/snackbarContextProvider.component"
import { useHistory } from "react-router"

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: "1.25rem",
        fontWeight: "bold",
    },
    accordion: {
        justifyContent: "center",
    },
    container: {
        display: "flex",
    },
    button: {
        backgroundColor: colors.teal_100,
        width: "100%",
        height: "100%",
        justifyContent: "left",
        fontSize: "1rem",
        boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
        "&:focus-within": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
        "&:hover": {
            backgroundColor: colors.teal_200,
        },
    },
    buttonText: {
        paddingLeft: "8px",
    },
    deleteButton: {
        backgroundColor: colors.gray_300,
        "&:hover": {
            backgroundColor: colors.gray_400,
        },
    },
})

export const AccordionGroupComponent = (props: {
    groupId: number
    title: string
    userIsOrgAdmin: boolean
    removeGroup: (groupId: number) => void
}) => {
    const { title, groupId, userIsOrgAdmin, removeGroup } = props
    const classes = useStyles()
    const { t } = useTranslation()

    const { launchSnackbar } = useSnackbarContext()

    const [addMemberDialogIsOpen, setAddMemberDialogIsOpen] = useState(false)
    const { groupFetched } = useGetGroup(groupId)
    const { deleteGroup } = useDeleteGroup(groupId)
    const { addGroupMember } = useAddGroupMember(groupId)
    const { updateGroup } = useUpdateGroup(groupId)
    const history = useHistory()
    const handleAddMemberClose = () => {
        setAddMemberDialogIsOpen(false)
    }

    const handleAddMember = async (user: IUser | undefined) => {
        if (user) {
            const { error, result } = await addGroupMember.run({
                newMemberUserId: user.userId,
                newMemberRole: UserRole.Member,
            })
            if (!error && result) {
                launchSnackbar(t("Snackbar.addMemberSuccess"), false)
                setAddMemberDialogIsOpen(false)
            }
        } else {
            launchSnackbar(t("Snackbar.addMemberError"), true)
        }
    }

    const [group, setGroup] = useState<IGroup | undefined>(groupFetched)
    const [groupInfoDialogIsOpen, setGroupInfoDialogIsOpen] = useState(false)
    const [editAdminsDialogIsOpen, setEditAdminsDialogIsOpen] = useState(false)
    const [deleteGroupDialogIsOpen, setDeleteGroupDialogIsOpen] =
        useState(false)
    const [editMembersDialogIsOpen, setEditMembersDialogIsOpen] =
        useState(false)

    const handleEditMembersDialogClose = () => {
        setEditMembersDialogIsOpen(false)
    }

    const handleOpenEditAdminsDialog = () => {
        setEditAdminsDialogIsOpen(true)
    }

    const handleCloseEditAdminsDialog = () => {
        setEditAdminsDialogIsOpen(false)
    }

    const handleOpenGroupInfoDialog = () => {
        setGroupInfoDialogIsOpen(true)
    }

    const handleCloseGroupInfoDialog = () => {
        setGroupInfoDialogIsOpen(false)
    }

    const handleDeleteGroupDialogClose = () => {
        setDeleteGroupDialogIsOpen(false)
    }

    const handleDeleteGroup = async () => {
        const { error, result } = await deleteGroup.run()
        if (!error && result) {
            removeGroup(groupId)
            handleDeleteGroupDialogClose()
        }
    }

    const handleUpdateDetails = async (
        name: string,
        address: string,
        phoneNumber: string,
        email: string,
        description: string
    ) => {
        const { error, result } = await updateGroup.run({
            name,
            address,
            phoneNumber,
            email,
            description,
        })

        if (!error && result) {
            handleCloseGroupInfoDialog()
            setGroup(result.data)
        }
    }

    const handleAddAdmin = (user: IUser) => {
        const updatedGroup = group
        if (updatedGroup?.admins) {
            updatedGroup.admins = [...updatedGroup.admins, user]
        }
        setGroup(updatedGroup)
    }

    const handleRemoveAdmin = (userId: number) => {
        const updatedGroup = group
        if (updatedGroup?.admins) {
            updatedGroup.admins = updatedGroup?.admins.filter(
                (user) => user.userId !== userId
            )
        }
        setGroup(updatedGroup)
    }

    const handleSeeAllSongs = () => {
        history.push(`/library?groupId=${groupId}`)
    }

    useEffect(() => {
        if (groupFetched) {
            setGroup(groupFetched)
        }
    }, [groupFetched])

    return (
        <div className={classes.root}>
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>
                        {group?.groupName}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>{group?.description}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                {t("AdminView.admin") + ": "}
                                {group?.admins?.[0]?.name ||
                                    group?.admins?.[0]?.email ||
                                    ""}
                                <br />
                                {t("AdminView.address") + ": "}
                                {group?.address || ""}
                                <br />
                                {t("AdminView.phoneNumber") + ": "}
                                {group?.phoneNumber || ""}
                                <br />
                                {t("AdminView.email") + ": "}
                                {group?.email || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() => {
                                    setEditMembersDialogIsOpen(true)
                                }}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.seeAllMembers")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={handleOpenGroupInfoDialog}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.editInfo")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={handleSeeAllSongs}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.seeAllSongs")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() => {
                                    setAddMemberDialogIsOpen(true)
                                }}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.addMember")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={handleOpenEditAdminsDialog}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.editAdmins")}
                                </div>
                            </Button>
                        </Grid>
                        {userIsOrgAdmin ? (
                            <Grid item xs={12} sm={4}>
                                <Button
                                    disableFocusRipple
                                    className={
                                        classes.button +
                                        " " +
                                        classes.deleteButton
                                    }
                                    onClick={() => {
                                        setDeleteGroupDialogIsOpen(true)
                                    }}
                                >
                                    <div className={classes.buttonText}>
                                        {t("AdminView.deleteGroup")}
                                    </div>
                                </Button>
                            </Grid>
                        ) : (
                            ""
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Dialog
                open={addMemberDialogIsOpen}
                onClose={handleAddMemberClose}
                aria-labelledby={t("AdminView.addMember")}
                maxWidth="sm"
                fullWidth
            >
                <AddGroupMemberDialog
                    handleOnCancelClick={handleAddMemberClose}
                    handleOnSaveClick={handleAddMember}
                    isGroup
                    groupId={groupId}
                    title={t("AdminView.addMemberTo") + " " + title}
                    descriptionText={t("AdminView.emailNewGroupMember")}
                    saveText={t("AdminView.add")}
                />
            </Dialog>
            <Dialog
                open={groupInfoDialogIsOpen}
                onClose={handleCloseGroupInfoDialog}
                aria-label={t("Dialog.groupInfo")}
            >
                <EditGroupInfoDialog
                    groupId={groupId}
                    group={group}
                    handleOnSaveClick={handleUpdateDetails}
                    handleOnCancelClick={handleCloseGroupInfoDialog}
                    isGroup
                />
            </Dialog>
            <Dialog
                open={editMembersDialogIsOpen}
                onClose={handleEditMembersDialogClose}
                aria-label={t("Dialog.editMembers")}
                maxWidth="sm"
                fullWidth
            >
                <EditMembersDialog
                    handleOnCloseClick={handleEditMembersDialogClose}
                    groupId={groupId}
                    groupName={groupFetched?.groupName || title}
                    isGroup
                />
            </Dialog>
            <Dialog
                open={editAdminsDialogIsOpen}
                onClose={handleCloseEditAdminsDialog}
                aria-label={t("Dialog.editAdmins")}
                maxWidth="xs"
                fullWidth
            >
                <EditAdminsDialog
                    groupId={groupId}
                    group={groupFetched}
                    isGroup
                    handleOnCloseClick={handleCloseEditAdminsDialog}
                    handleAddAdminInGroupObject={handleAddAdmin}
                    handleRemoveAdminFromGroupObject={handleRemoveAdmin}
                />
            </Dialog>
            <Dialog
                open={deleteGroupDialogIsOpen}
                onClose={handleDeleteGroupDialogClose}
                aria-label={t("AdminView.deleteGroup")}
            >
                <ChoiceDialog
                    handleOnCancelClick={handleDeleteGroupDialogClose}
                    handleOnSaveClick={handleDeleteGroup}
                    ackText={t("AdminView.deleteGroup")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("AdminView.deleteGroup")}
                    descriptionText={t("Dialog.deleteGroupDescription")}
                />
            </Dialog>
        </div>
    )
}
