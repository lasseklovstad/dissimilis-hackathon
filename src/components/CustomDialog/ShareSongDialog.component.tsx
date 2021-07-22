import {
    Typography,
    Grid,
    Switch,
    TextField,
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
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
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
    useShareSong,
    useUnshareSong,
} from "../../utils/useApiServiceSongs"
import { InputDialog } from "./InputDialog.component"
import { ChoiceDialog } from "./ChoiceDialog.component"

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
    const { getSongShareInfo, songShareInfo } = useGetSongShareInfo(songId)
    const { shareSong } = useShareSong(songId)
    const { unshareSong } = useUnshareSong(songId)

    const [publicSong, setPublicSong] = useState(false)
    const [userList, setUserList] = useState<IUser[]>([])
    const [addUserDialogIsOpen, setAddUserDialogIsOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<IUser>()
    const [confirmRemoveUserDialogIsOpen, setConfirmRemoveUserDialogIsOpen] =
        useState(false)

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

    const onTagChange = (event: any, value: any) => {
        console.log(value)
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
            setUserList(userList.concat(result.data[0]))
            handleCloseAddUserDialog()
        }
    }

    const handleRemoveUser = async () => {
        const { error, result } = await unshareSong.run(
            `/${selectedUser?.userId}`
        )
        if (!error && result) {
            setUserList(
                userList.filter((user) => user.userId != selectedUser?.userId)
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
            setPublicSong(protectionLevel == SongProtectionLevel.Public)
            console.log("1" + sharedWithUsers)
            setUserList(sharedWithUsers)
        }
    }, [songShareInfo])

    return (
        <>
            <DialogTitle>{"Del Sang"}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" className={classes.item}>
                    Redigeringstilganger
                </Typography>
                <Typography variant="caption">
                    {"Personer sangen er delt med og som kan redigere"}
                </Typography>
                {userList && userList.length > 0 ? (
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
                <Button
                    disableFocusRipple
                    className={classes.button + " " + classes.item}
                    variant="outlined"
                    onClick={() => setAddUserDialogIsOpen(true)}
                >
                    <AddIcon />
                    <div className={classes.buttonText}>
                        {"Legg til bruker"}
                    </div>
                </Button>

                <Typography variant="body1" className={classes.item}>
                    Lesetilganger
                </Typography>
                <Typography variant="caption">
                    {
                        "Hvem skal sangen være synlig for annet en de den er delt med?"
                    }
                </Typography>
                <Typography component="div" className={classes.item}>
                    <Grid
                        component="label"
                        container
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item>Ingen</Grid>
                        <Grid item>
                            <Switch
                                checked={publicSong}
                                onChange={handleChangePublicPrivate}
                                name="publicSongState"
                            />
                        </Grid>
                        <Grid item>Alle</Grid>
                    </Grid>
                </Typography>
                {publicSong ? (
                    <>
                        <Typography variant="caption">
                            {
                                "Gjør det enklere for folk å finne sangen ved å legge på tags"
                            }
                        </Typography>
                        <Autocomplete
                            multiple
                            className={classes.item}
                            id="tags-outlined"
                            options={[]}
                            disabled={!publicSong}
                            onChange={onTagChange}
                            //getOptionLabel={(option) => option.title}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Søketags"
                                    placeholder="Tags"
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
                aria-label={"Share with new user dialog"}
            >
                <InputDialog
                    handleOnSaveClick={handleAddUser}
                    handleOnCancelClick={handleCloseAddUserDialog}
                    cancelText={"Cancel"}
                    saveText={"Add"}
                    headerText={"Add user"}
                    labelText={"User email"}
                />
            </Dialog>
            <Dialog
                open={confirmRemoveUserDialogIsOpen}
                onClose={handleCloseConfirmRemoveUserDialog}
                aria-label={"Unshare with new user dialog"}
            >
                <ChoiceDialog
                    handleOnSaveClick={handleRemoveUser}
                    handleOnCancelClick={handleCloseConfirmRemoveUserDialog}
                    ackText={"Save"}
                    cancelText={"Cancel"}
                    descriptionText={"Remove person"}
                    headerText={"Remove person"}
                />
            </Dialog>
        </>
    )
}
