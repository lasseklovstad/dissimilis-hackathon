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
    makeStyles,
    DialogActions,
    Dialog,
    TextField,
    CircularProgress,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { IUser } from "../../models/IUser"
import { Delete as DeleteIcon, Add as AddIcon } from "@material-ui/icons"
import { colors } from "../../utils/colors"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import {
    SongProtectionLevel,
    useChangeSongProtectionLevel,
    useGetSongShareInfo,
    useSetGroupTags,
    useSetOrganisationTags,
    useShareSong,
    useUnshareSong,
} from "../../utils/useApiServiceSongs"
import { ChoiceDialog } from "./ChoiceDialog.component"
import { IGroupIndex } from "../../models/IGroup"
import { IOrganisationIndex } from "../../models/IOrganisation"
import {
    useGetGroups,
    GroupFilter,
    useGetOrganisations,
    OrganisationFilter,
} from "../../utils/useApiServiceGroups"
import { Autocomplete } from "@material-ui/lab"
import { UserAutoCompleteDialog } from "./UserAutoCompleteDialog.component"
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
    const { setOrganisationTags } = useSetOrganisationTags(songId)
    const { users } = useGetUsers()
    const { organisationsFetched } = useGetOrganisations(
        OrganisationFilter.Member
    )
    const { groupsFetched } = useGetGroups(GroupFilter.Member)
    const userId = sessionStorage.getItem("userId") || undefined

    const [sharedWithUserList, setSharedWithUserList] = useState<IUser[]>([])
    const [selectedUser, setSelectedUser] = useState<IUser>()
    const [confirmRemoveUserDialogIsOpen, setConfirmRemoveUserDialogIsOpen] =
        useState(false)
    const [addUserDialogIsOpen, setAddUserDialogIsOpen] = useState(false)
    const [filteredUserList, setFilteredUserList] = useState<IUser[]>()

    const [publicSong, setPublicSong] = useState(false)

    const [groups, setGroups] = useState<IGroupIndex[] | undefined>()
    const [organisations, setOrganisations] = useState<
        IOrganisationIndex[] | undefined
    >()
    const [defaultGroupTagIds, setDefaultGroupTagIds] = useState<number[]>()
    const [defaultOrgTagIds, setDefaultOrgTagIds] = useState<number[]>()
    const [filteredGroupTags, setFilteredGroupTags] = useState<IGroupIndex[]>()
    const [filteredOrgTags, setFilteredOrgTags] =
        useState<IOrganisationIndex[]>()
    const [tags, setTags] = useState<(IGroupIndex | IOrganisationIndex)[]>()
    const tagOptions = [...(groups || []), ...(organisations || [])]

    useEffect(() => {
        if (groupsFetched) {
            setGroups(groupsFetched)
        }
    }, [groupsFetched])

    useEffect(() => {
        if (organisationsFetched) {
            setOrganisations(organisationsFetched)
        }
    }, [organisationsFetched])

    useEffect(() => {
        if (songShareInfo) {
            const {
                groupTags,
                organisationTags,
                protectionLevel,
                sharedWithUsers,
            } = songShareInfo
            setPublicSong(protectionLevel === SongProtectionLevel.Public)
            setSharedWithUserList(sharedWithUsers)
            setDefaultGroupTagIds(
                groupTags.map((group) => {
                    return group.groupId
                })
            )
            setDefaultOrgTagIds(
                organisationTags.map((organisation) => {
                    return organisation.organisationId
                })
            )
        }
    }, [songShareInfo])

    useEffect(() => {
        if (defaultGroupTagIds && groups) {
            setFilteredGroupTags(
                groups.filter(
                    (group) => defaultGroupTagIds.indexOf(group.groupId) > -1
                )
            )
        }
    }, [defaultGroupTagIds, groups])

    useEffect(() => {
        if (defaultOrgTagIds && organisations) {
            setFilteredOrgTags(
                organisations.filter(
                    (organisations) =>
                        defaultOrgTagIds.indexOf(organisations.organisationId) >
                        -1
                )
            )
        }
    }, [defaultOrgTagIds, organisations])

    useEffect(() => {
        setTags([...(filteredGroupTags || []), ...(filteredOrgTags || [])])
    }, [filteredOrgTags, filteredGroupTags])

    useEffect(() => {
        if (userId && users) {
            setFilteredUserList(
                users.filter(
                    (user) =>
                        !(
                            user.userId === Number(userId) ||
                            sharedWithUserList.some(
                                (sharedUser) =>
                                    user.userId === sharedUser.userId
                            )
                        )
                )
            )
        }
    }, [userId, users, sharedWithUserList])

    const handleCloseAddUserDialog = () => {
        setAddUserDialogIsOpen(false)
    }

    const handleCloseConfirmRemoveUserDialog = () => {
        setConfirmRemoveUserDialogIsOpen(false)
    }

    const handleAddUser = async (user: IUser | undefined) => {
        if (user) {
            const { error, result } = await shareSong.run(
                null,
                `/${user.userId}`
            )
            if (!error && result) {
                setSharedWithUserList(result.data)
                handleCloseAddUserDialog()
            }
            if (error) {
                //Launch snackbar
            }
        } else {
            //Launch snackbar
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
            //Launch snackbar
        }
    }

    const handleChangePublicPrivate = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPublicSong(event.target.checked)
        const { error } = await changeSongProtectionLevel.run({
            protectionLevel: event.target.checked
                ? SongProtectionLevel.Public
                : SongProtectionLevel.Private,
        })
        if (error) {
            //Launch snackbar
        }
    }

    const onTagChange = async (
        event: any,
        value: (IGroupIndex | IOrganisationIndex)[]
    ) => {
        setTags(value)
        const orgTagList: number[] = []
        const groupTagList: number[] = []
        value.forEach((group) => {
            "groupName" in group
                ? groupTagList.push(group.groupId)
                : orgTagList.push(group.organisationId)
        })
        const { error: groupError } = await setGroupTags.run({
            tagIds: groupTagList,
        })

        const { error: orgError } = await setOrganisationTags.run({
            tagIds: orgTagList,
        })

        if (groupError || orgError) {
            //Launch snackbar
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
                    <Grid xs={12}>
                        <CircularProgress
                            aria-label="Loading"
                            size={50}
                            style={{ margin: "30px" }}
                        />
                    </Grid>
                ) : sharedWithUserList &&
                  sharedWithUserList !== undefined &&
                  sharedWithUserList.length > 0 ? (
                    <List
                        dense={false}
                        className={classes.item}
                        style={{ maxHeight: 150, overflow: "auto" }}
                    >
                        {sharedWithUserList.map((user) => {
                            return (
                                <ListItem key={user.email + "-list-item"}>
                                    <ListItemText
                                        primary={user.name}
                                        secondary={user.email}
                                        className={classes.iconButton}
                                        secondaryTypographyProps={{
                                            className:
                                                classes.secondaryTypography,
                                        }}
                                    />
                                    <ListItemSecondaryAction
                                        onClick={() => {
                                            setSelectedUser(user)
                                            setConfirmRemoveUserDialogIsOpen(
                                                true
                                            )
                                        }}
                                    >
                                        <IconButton
                                            edge="end"
                                            aria-label={t(
                                                "Dialog.removePerson"
                                            )}
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
                <Typography variant="caption">
                    {t("Dialog.readRightsDescription")}
                </Typography>
                {getSongShareInfo.loading ? (
                    <Grid xs={12}>
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
                            />
                        </Grid>
                        <Grid item>{t("Dialog.everyone")}</Grid>
                    </Grid>
                )}
                {publicSong ? (
                    <>
                        <Typography variant="caption">
                            {t("Dialog.tagsDescription")}
                        </Typography>
                        <Autocomplete
                            style={{
                                marginBottom: "1.5em",
                                maxHeight: 150,
                                overflow: "auto",
                            }}
                            multiple
                            id="tags-outlined"
                            options={tagOptions}
                            value={tags}
                            getOptionLabel={(option) =>
                                "groupName" in option
                                    ? option.groupName
                                    : option.organisationName
                            }
                            filterSelectedOptions
                            onChange={onTagChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder={t("Dialog.tags")}
                                />
                            )}
                        />
                    </>
                ) : (
                    ""
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
                <UserAutoCompleteDialog
                    handleOnSaveClick={handleAddUser}
                    handleOnCancelClick={handleCloseAddUserDialog}
                    userList={filteredUserList || []}
                    title={t("Dialog.shareWithPerson")}
                    saveText={t("Dialog.addPerson")}
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
