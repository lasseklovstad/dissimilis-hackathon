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
    ListItemText,
    DialogActions,
    Dialog,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { IUser } from "../../../models/IUser"
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material"
import { DialogButton } from "../../CustomDialogComponents/DialogButton.components"
import {
    useChangeSongProtectionLevel,
    useGetSongShareInfo,
    useSetGroupTags,
    useUnshareSong,
} from "../../../utils/useApiServiceSongs"
import { SongProtectionLevel } from "../../../models/SongProtectionLevel"
import { ChoiceDialog } from "../ChoiceDialog.component"
import { IGroupIndex } from "../../../models/IGroup"
import { useSnackbarContext } from "../../../utils/snackbarContextProvider.component"
import { GroupAutocomplete } from "../../GroupAutocomplete/GroupAutocomplet.component"
import { GroupFilter } from "../../../utils/useApiServiceGroups"
import { Loading } from "../../loading/Loading.component"
import { GroupUsersDialog } from "./GroupUsersDialog.component"

export const ShareSongDialog = (props: {
    handleOnCloseClick: () => void
    songId: number
}) => {
    const { t } = useTranslation()

    const { handleOnCloseClick, songId } = props

    const { changeSongProtectionLevel } = useChangeSongProtectionLevel(songId)
    const { getSongShareInfo, songShareInfo } = useGetSongShareInfo(songId)
    const { unshareSong } = useUnshareSong(songId)
    const { setGroupTags } = useSetGroupTags(songId)
    const [sharedWithUserList, setSharedWithUserList] = useState<IUser[]>([])

    const [confirmRemoveUserDialogIsOpen, setConfirmRemoveUserDialogIsOpen] =
        useState(false)
    const [addUserDialogIsOpen, setAddUserDialogIsOpen] = useState(false)
    const [publicSong, setPublicSong] = useState(false)
    const [filteredGroupTags, setFilteredGroupTags] = useState<IGroupIndex[]>(
        []
    )
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

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

    const handleAddUser = (users: IUser[]) => {
        setSharedWithUserList(users)
        handleCloseAddUserDialog()
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

    if (getSongShareInfo.loading) {
        return <Loading isLoading />
    }

    return (
        <>
            <DialogTitle>{t("Dialog.shareSong")}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    {t("Dialog.editRights")}
                </Typography>
                <Typography variant="caption">
                    {t("Dialog.editRightsDescription")}
                </Typography>

                {!!sharedWithUserList?.length && (
                    <List aria-label={t("Dialog.editRightsList")}>
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
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                )}
                <Button
                    disableFocusRipple
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setAddUserDialogIsOpen(true)}
                >
                    {t("Dialog.addPerson")}
                </Button>

                <Typography variant="body1" sx={{ mt: 3 }}>
                    {t("Dialog.readRights")}
                </Typography>
                <Typography variant="caption" id="share-description">
                    {t("Dialog.readRightsDescription")}
                </Typography>

                <Grid container alignItems="center" spacing={1}>
                    <Grid item>{t("Dialog.noOne")}</Grid>
                    <Grid item>
                        <Switch
                            checked={publicSong}
                            onChange={handleChangePublicPrivate}
                            name="publicSongState"
                            color="secondary"
                            inputProps={{
                                "aria-label": t<string>("Dialog.everyoneLabel"),
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
                {publicSong && (
                    <>
                        <Typography variant="caption">
                            {t("Dialog.tagsDescription")}
                        </Typography>
                        <GroupAutocomplete
                            selectedGroups={filteredGroupTags.map((group) =>
                                group.groupId.toString()
                            )}
                            label={t<string>("Dialog.tags")}
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
                fullWidth
                maxWidth="sm"
            >
                <GroupUsersDialog
                    sharedWithUser={sharedWithUserList || []}
                    onClose={handleCloseAddUserDialog}
                    onAddUser={handleAddUser}
                    songId={songId}
                />
            </Dialog>
            <Dialog
                open={confirmRemoveUserDialogIsOpen}
                onClose={handleCloseConfirmRemoveUserDialog}
                aria-label={t("Dialog.removePersonShare")}
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
                    headerText={t("Dialog.removePersonShare")}
                />
            </Dialog>
        </>
    )
}
