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
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IUser } from "../../models/IUser"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"
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
import { InputDialog } from "./InputDialog.component"
import { ChoiceDialog } from "./ChoiceDialog.component"
import { IGroupIndex } from "../../models/IGroup"
import { IOrganisationIndex } from "../../models/IOrganisation"
import { SearchFilterAutocomplete } from "../songGrid/SearchFilterAutocomplete.component"
import {
    useGetGroups,
    GroupFilter,
    useGetOrganisations,
    OrganisationFilter,
} from "../../utils/useApiServiceGroups"
import { Autocomplete } from "@material-ui/lab"

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
    isLoading?: boolean
    songId: number
}) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { handleOnCloseClick, isLoading = false, songId } = props
    const { changeSongProtectionLevel } = useChangeSongProtectionLevel(songId)
    const { songShareInfo } = useGetSongShareInfo(songId)
    const { shareSong } = useShareSong(songId)
    const { unshareSong } = useUnshareSong(songId)
    const { setGroupTags } = useSetGroupTags(songId)
    const { setOrganisationTags } = useSetOrganisationTags(songId)
    const [publicSong, setPublicSong] = useState(false)
    const [userList, setUserList] = useState<IUser[]>([])
    const [addUserDialogIsOpen, setAddUserDialogIsOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<IUser>()
    const [confirmRemoveUserDialogIsOpen, setConfirmRemoveUserDialogIsOpen] =
        useState(false)
    const { allGroupsFetched } = useGetGroups(GroupFilter.User)
    const [groups, setGroups] = useState<IGroupIndex[] | undefined>()
    useEffect(() => {
        if (allGroupsFetched) {
            setGroups(allGroupsFetched)
        }
    }, [allGroupsFetched])

    const { organisationsFetched } = useGetOrganisations(
        OrganisationFilter.User
    )
    const [organisations, setorganisations] = useState<
        IOrganisationIndex[] | undefined
    >()
    useEffect(() => {
        if (organisationsFetched) {
            setorganisations(organisationsFetched)
        }
    }, [organisationsFetched])
    const [defaultGroupTagIds, setDefaultGroupTagIds] = useState<number[]>()
    const [defaultOrgTagIds, setDefaultOrgTagIds] = useState<number[]>()

    const options = [
        ...(groups ? groups : []),
        ...(organisations ? organisations : []),
    ]

    const [filteredGroupTags, setFilteredGroupTags] = useState<IGroupIndex[]>()
    const [filteredOrgTags, setFilteredOrgTags] =
        useState<IOrganisationIndex[]>()

    const [tags, setTags] = useState<(IGroupIndex | IOrganisationIndex)[]>()

    const handleChangePublicPrivate = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPublicSong(event.target.checked)
        const { error, result } = await changeSongProtectionLevel.run({
            protectionLevel: event.target.checked
                ? SongProtectionLevel.Public
                : SongProtectionLevel.Private,
        })
    }

    const onTagChange = async (
        event: any,
        value: (IGroupIndex | IOrganisationIndex)[]
    ) => {
        setTags(value)
        const orgTagList: number[] = []
        const groupTagList: number[] = []
        value.map((group) => {
            "groupName" in group
                ? groupTagList.push(group.groupId)
                : orgTagList.push(group.organisationId)
            return ""
        })
        console.log(orgTagList)
        console.log(groupTagList)
        const { error: groupError, result: groupResult } =
            await setGroupTags.run({
                tagIds: groupTagList,
            })

        const { error: orgError, result: orgResult } =
            await setOrganisationTags.run({
                tagIds: orgTagList,
            })
    }

    const handleCloseAddUserDialog = () => {
        setAddUserDialogIsOpen(false)
    }

    const handleCloseConfirmRemoveUserDialog = () => {
        setConfirmRemoveUserDialogIsOpen(false)
    }

    const handleAddUser = async (userId: string) => {
        const { error, result } = await shareSong.run(null, `/${userId}`)
        if (!error && result) {
            setUserList(result.data)
            handleCloseAddUserDialog()
        }
    }

    const handleRemoveUser = async () => {
        const { error, result } = await unshareSong.run(
            `/${selectedUser?.userId}`
        )
        if (!error && result) {
            setUserList(
                userList.filter((user) => user.userId !== selectedUser?.userId)
            )
            handleCloseConfirmRemoveUserDialog()
        }
    }

    useEffect(() => {
        if (songShareInfo) {
            const {
                groupTags,
                organisationTags,
                protectionLevel,
                sharedWithUsers,
            } = songShareInfo
            setPublicSong(protectionLevel === SongProtectionLevel.Public)
            setUserList(sharedWithUsers)
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
            console.log("DefaultGroupTagsIds: " + defaultGroupTagIds)
            console.log(
                "Groups: " +
                    groups.filter(
                        (group) =>
                            defaultGroupTagIds.indexOf(group.groupId) > -1
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
        setTags([
            ...(filteredGroupTags ? filteredGroupTags : []),
            ...(filteredOrgTags ? filteredOrgTags : []),
        ])
    }, [filteredOrgTags, filteredGroupTags])

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
                {userList && userList !== undefined && userList.length > 0 ? (
                    <List
                        dense={false}
                        className={classes.item}
                        style={{ maxHeight: 150, overflow: "auto" }}
                    >
                        {userList.map((user) => {
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
                <Typography component="div" className={classes.item}>
                    <Grid
                        component="label"
                        container
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item>{t("Dialog.noOne")}</Grid>
                        <Grid item>
                            <Switch
                                checked={publicSong}
                                onChange={handleChangePublicPrivate}
                                name="publicSongState"
                            />
                        </Grid>
                        <Grid item>{t("Dialog.everyone")}</Grid>
                    </Grid>
                </Typography>
                {publicSong ? (
                    <>
                        <Typography variant="caption">
                            {t("Dialog.tagsDescription")}
                        </Typography>
                        <Autocomplete
                            style={{ marginBottom: "1.5em" }}
                            multiple
                            id="tags-outlined"
                            options={options}
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
                                    placeholder="Choose a group"
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
                <InputDialog
                    handleOnSaveClick={handleAddUser}
                    handleOnCancelClick={handleCloseAddUserDialog}
                    cancelText={t("Dialog.cancel")}
                    saveText={t("Dialog.addPerson")}
                    headerText={t("Dialog.shareWithPerson")}
                    labelText={t("Dialog.email")}
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
