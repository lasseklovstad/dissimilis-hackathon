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
    Typography,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import DeleteIcon from "@mui/icons-material/Delete"
import { IUser } from "../../models/IUser"
import { colors } from "../../utils/colors"
import AddIcon from "@mui/icons-material/Add"
import { ChoiceDialog } from "./ChoiceDialog.component"
import { UserAutoCompleteDialog } from "./UserAutoCompleteDialog.component"
import {
    useGetSysAdmins,
    useGetUsers,
    useSetSysAdminStatus,
} from "../../utils/useApiServiceUsers"
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

export const EditSysAdminsDialog = (props: {
    handleOnCloseClick: () => void
}) => {
    const { handleOnCloseClick } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const secondary = true

    const { users } = useGetUsers()
    const { sysAdmins } = useGetSysAdmins()
    const { setSysAdminStatus } = useSetSysAdminStatus()

    const [addAdminDialogIsOpen, setAddAdminDialogIsOpen] = useState(false)
    const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
        useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<IUser>()

    const [adminList, setAdminsList] = useState<IUser[]>([])
    const [userList, setUserList] = useState<IUser[]>()

    const { launchSnackbar } = useSnackbarContext()

    const handleUpdateRole = async (sysAdmin: boolean, user: IUser) => {
        const { error } = await setSysAdminStatus.run(
            {
                isSystemAdmin: sysAdmin,
            },
            `${user.userId}/updateSysAdminStatus`
        )
        return !!error
    }

    const handleDeleteAdmin = async () => {
        if (adminList.length > 1) {
            if (selectedAdmin) {
                const isError = await handleUpdateRole(false, selectedAdmin)
                if (!isError && selectedAdmin) {
                    setAdminsList(
                        adminList.filter(
                            (user) => user.userId !== selectedAdmin.userId
                        )
                    )
                    setConfirmationDialogIsOpen(false)
                } else {
                    launchSnackbar(t("Snackbar.removeAdmin"), true)
                }
            }
            return false
        } else {
            launchSnackbar(t("Snackbar.oneAdminLeft"), true)
            setConfirmationDialogIsOpen(false)
            return false
        }
    }

    const handleAddAdmin = async (user: IUser | undefined) => {
        if (user) {
            const isError = await handleUpdateRole(true, user)
            if (!isError && user) {
                setAdminsList([...adminList, user])
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

    useEffect(() => {
        if (users) {
            setUserList(users)
        }
    }, [users])

    useEffect(() => {
        if (sysAdmins) {
            setAdminsList(sysAdmins)
        }
    }, [sysAdmins])

    const handleCloseAddAdminDialog = () => {
        setAddAdminDialogIsOpen(false)
    }

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogIsOpen(false)
    }

    return <>
        <DialogTitle>{t("Dialog.editSysAdmins")}</DialogTitle>
        <DialogContent>
            <Typography variant="caption">
                {t("Dialog.adminsIn")} {t("AdminView.system")}
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
                            <IconButton edge="end" aria-label="delete" size="large">
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
                                    {t("Dialog.addSysAdmin")}
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
            aria-label={t("Dialog.addSysAdmin")}
            maxWidth="xs"
            fullWidth
        >
            <UserAutoCompleteDialog
                handleOnCancelClick={handleCloseAddAdminDialog}
                handleOnSaveClick={handleAddAdmin}
                saveText={t("Dialog.add")}
                title={t("Dialog.addSysAdmin")}
                descriptionText={t("Dialog.emailOfNewAdmin")}
                userList={filterAdmins()}
            />
        </Dialog>
        <Dialog
            open={confirmationDialogIsOpen}
            onClose={handleCloseConfirmationDialog}
            aria-label={t("Dialog.removeSysAdmin")}
        >
            <ChoiceDialog
                handleOnCancelClick={handleCloseConfirmationDialog}
                handleOnSaveClick={handleDeleteAdmin}
                ackText={t("Dialog.removeSysAdmin")}
                cancelText={t("Dialog.cancel")}
                headerText={t("Dialog.removeSysAdmin")}
                descriptionText={`
                    ${t("Dialog.removeAdminDescription")} 
                    ${selectedAdmin?.name || t("Dialog.thisUser")} 
                    ${t("Dialog.asSysAdmin")} 
                    ${t("Dialog.cannotUndo")}
                `}
            />
        </Dialog>
    </>;
}
