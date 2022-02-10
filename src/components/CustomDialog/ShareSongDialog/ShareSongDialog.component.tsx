import React, { useEffect, useState } from "react"
import {
    Typography,
    Grid,
    Switch,
    Button,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    DialogActions,
    Dialog,
    CircularProgress,
} from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { useTranslation } from "react-i18next"
import { IUser } from "../../../models/IUser"
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material"
import { colors } from "../../../utils/colors"
import { DialogButton } from "../../CustomDialogComponents/DialogButton.components"
import {
    useChangeSongProtectionLevel,
    useGetSongShareInfo,
    useSetGroupTags,
    useShareSong,
    useUnshareSong,
} from "../../../utils/useApiServiceSongs"
import { SongProtectionLevel } from "../../../models/SongProtectionLevel"
import { ChoiceDialog } from "../ChoiceDialog.component"
import { IGroupIndex } from "../../../models/IGroup"
import { InputDialog } from "../InputDialog.component"
import { useSnackbarContext } from "../../../utils/snackbarContextProvider.component"
import { GroupAutocomplete } from "../../GroupAutocomplete/GroupAutocomplet.component"
import { GroupFilter } from "../../../utils/useApiServiceGroups"
import { Loading } from "../../loading/Loading.component"

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
            height: "100%",
            justifyContent: "left",
            fontSize: "0.9rem",
            padding: theme.spacing(1),
            "&:hover": {
                backgroundColor: colors.white,
            },
        },
        buttonText: {
            paddingLeft: "8px",
        },
        item: {
            marginBottom: theme.spacing(2),
        },
    }
})

export const ShareSongDialog = (props: {
    handleOnCloseClick: () => void
    songId: number
}) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const { handleOnCloseClick, songId } = props

    const { changeSongProtectionLevel } = useChangeSongProtectionLevel(songId)
    const { getSongShareInfo, songShareInfo } = useGetSongShareInfo(songId)
    const { shareSong } = useShareSong(songId)
    const { unshareSong } = useUnshareSong(songId)
    const { setGroupTags } = useSetGroupTags(songId)
    const [sharedWithUserList, setSharedWithUserList] = useState<IUser[]>([])
    const [selectedUser, setSelectedUser] = useState<IUser>()
    const [confirmRemoveUserDialogIsOpen, setConfirmRemoveUserDialogIsOpen] =
        useState(false)
    const [addUserDialogIsOpen, setAddUserDialogIsOpen] = useState(false)
    const [publicSong, setPublicSong] = useState(false)
    const [filteredGroupTags, setFilteredGroupTags] = useState<IGroupIndex[]>(
        []
    )

    const { launchSnackbar } = useSnackbarContext()

    useEffect(() => {
        if (songShareInfo) {
            const { groupTags, protectionLevel, sharedWithUsers } =
                songShareInfo
            setPublicSong(protectionLevel === SongProtectionLevel.Public)
            setSharedWithUserList(sharedWithUsers)
            setFilteredGroupTags(groupTags)
        }
    }, [songShareInfo])

    const handleCloseAddUserDialog = () => {
        setAddUserDialogIsOpen(false)
    }

    const handleCloseConfirmRemoveUserDialog = () => {
        setConfirmRemoveUserDialogIsOpen(false)
    }

    const handleAddUser = async (userEmail: string) => {
        if (userEmail) {
            const { error, result } = await shareSong.run(
                null,
                `?userEmail=${userEmail}`
            )
            if (!error && result) {
                setSharedWithUserList(result.data)
                handleCloseAddUserDialog()
            }
            if (error) {
                launchSnackbar(t("Snackbar.addShareUser"), true)
            }
        } else {
            handleCloseAddUserDialog()
        }
    }

    const handleRemoveUser = async () => {
        const { error, result } = await unshareSong.run(
            `/${selectedUser?.userId}`
        )
        if (!error && result) {
            setSharedWithUserList(
                sharedWithUserList.filter(
                    (user) => user.userId !== selectedUser?.userId
                )
            )
            handleCloseConfirmRemoveUserDialog()
        }
        if (error) {
            launchSnackbar(t("Snackbar.removeShareUser"), true)
        }
    }

    const handleChangePublicPrivate = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const isPublic = event.target.checked
        const { error } = await changeSongProtectionLevel.run({
            protectionLevel: isPublic
                ? SongProtectionLevel.Public
                : SongProtectionLevel.Private,
        })
        if (error) {
            launchSnackbar(t("Snackbar.changeProtectionLevel"), true)
        } else {
            setPublicSong(isPublic)
        }
    }

    const onGroupChange = async (selectedGroups: IGroupIndex[]) => {
        const { error } = await setGroupTags.run({
            tagIds: selectedGroups.map((group) => group.groupId),
        })

        if (error) {
            launchSnackbar(t("Snackbar.addTag"), true)
        } else {
            setFilteredGroupTags(selectedGroups)
        }
    }

    return (
        <>
            <DialogTitle>{t("Dialog.shareSong")}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" className={classes.item}>
                    {t("Dialog.editRights")}
                </Typography>
                <Typography variant="caption">
                    {t("Dialog.editRightsDescription")}
                </Typography>
                {getSongShareInfo.loading ? (
                    <Grid item xs={12}>
                        <CircularProgress
                            aria-label="Loading"
                            size={50}
                            style={{ margin: "30px" }}
                        />
                    </Grid>
                ) : sharedWithUserList &&
                  sharedWithUserList !== undefined &&
                  sharedWithUserList.length > 0 ? (
                    <List dense={false} className={classes.item} aria-label={t("Dialog.editRightsList")}>
                        {sharedWithUserList.map((user) => {
                            return (
                                <ListItem
                                    key={user.userId}
                                    secondaryAction={
                                        <IconButton
                                            aria-label={t(
                                                "Dialog.removePerson"
                                            )}
                                            onClick={() => {
                                                setSelectedUser(user)
                                                setConfirmRemoveUserDialogIsOpen(
                                                    true
                                                )
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={user.name}
                                        secondary={user.email}
                                        className={classes.iconButton}
                                        secondaryTypographyProps={{
                                            className:
                                                classes.secondaryTypography,
                                        }}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                ) : (
                    ""
                )}
                <Button
                    disableFocusRipple
                    className={classes.button + " " + classes.item}
                    variant="outlined"
                    onClick={() => setAddUserDialogIsOpen(true)}
                >
                    <AddIcon />
                    <div className={classes.buttonText}>
                        {t("Dialog.addPerson")}
                    </div>
                </Button>

                <Typography variant="body1" className={classes.item}>
                    {t("Dialog.readRights")}
                </Typography>
                <Typography variant="caption" id="share-description">
                    {t("Dialog.readRightsDescription")}
                </Typography>
                {getSongShareInfo.loading ? (
                    <Grid item xs={12}>
                        <CircularProgress
                            aria-label="Loading"
                            size={30}
                            style={{
                                marginTop: "20px",
                                marginLeft: "20px",
                            }}
                        />
                    </Grid>
                ) : (
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>{t("Dialog.noOne")}</Grid>
                        <Grid item>
                            <Switch
                                checked={publicSong}
                                onChange={handleChangePublicPrivate}
                                name="publicSongState"
                                color={"secondary"}
                                inputProps={{
                                    "aria-label": t<string>(
                                        "Dialog.everyoneLabel"
                                    ),
                                    "aria-describedby": "share-description",
                                }}
                            />
                        </Grid>
                        <Grid item>{t("Dialog.everyone")}</Grid>
                        {changeSongProtectionLevel.loading && (
                            <Grid>
                                <Loading isLoading />
                            </Grid>
                        )}
                    </Grid>
                )}
                {publicSong && (
                    <>
                        <Typography variant="caption">
                            {t("Dialog.tagsDescription")}
                        </Typography>
                        <GroupAutocomplete
                            selectedGroups={filteredGroupTags.map((group) =>
                                group.groupId.toString()
                            )}
                            placeholder={t<string>("Dialog.tags")}
                            onGroupChange={onGroupChange}
                            groupFilter={GroupFilter.Member}
                        />
                    </>
                )}
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
                open={addUserDialogIsOpen}
                onClose={handleCloseAddUserDialog}
                aria-label={t("Dialog.shareWithPerson")}
            >
                <InputDialog
                    handleOnSaveClick={handleAddUser}
                    handleOnCancelClick={handleCloseAddUserDialog}
                    headerText={t("Dialog.shareWithPerson")}
                    saveText={t("Dialog.addPerson")}
                    cancelText={t("Dialog.cancel")}
                    labelText={t("Dialog.email")}
                    characterLimit={250}
                />
            </Dialog>
            <Dialog
                open={confirmRemoveUserDialogIsOpen}
                onClose={handleCloseConfirmRemoveUserDialog}
                aria-label={t("Dialog.unshare")}
            >
                <ChoiceDialog
                    handleOnSaveClick={handleRemoveUser}
                    handleOnCancelClick={handleCloseConfirmRemoveUserDialog}
                    ackText={t("Dialog.unshare")}
                    cancelText={t("Dialog.cancel")}
                    descriptionText={
                        t("Dialog.removePersonShareDescription") +
                        selectedUser?.name
                    }
                    headerText={t("Dialog.removePerson")}
                />
            </Dialog>
        </>
    )
}
