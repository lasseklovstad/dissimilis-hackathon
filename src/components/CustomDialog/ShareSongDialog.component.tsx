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
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { IUser } from "../../models/IUser"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"
import { colors } from "../../utils/colors"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

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

    const [publicSong, setPublicSong] = useState({
        publicSongState: false,
    })

    const userList: IUser[] = [
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
        },
    ]

    const getSharedWith = () => {
        return userList //ENDRE
    }

    const handleChangePublicPrivate = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPublicSong({
            ...publicSong,
            [event.target.name]: event.target.checked,
        })
    }

    const onTagChange = (event: any, value: any) => {
        console.log(value)
    }

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
                <List
                    dense={false}
                    className={classes.item}
                    style={{ maxHeight: 150, overflow: "auto" }}
                >
                    {getSharedWith().map((user) => {
                        return (
                            <ListItem key={user.email + "-list-item"}>
                                <ListItemText
                                    primary={user.name}
                                    secondary={user.email}
                                    className={classes.iconButton}
                                    secondaryTypographyProps={{
                                        className: classes.secondaryTypography,
                                    }}
                                />
                                <ListItemSecondaryAction
                                    onClick={() => {
                                        /*setSelectedUser(user)
                                        handleOpenConfirmationDialog()*/
                                    }}
                                >
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })}
                </List>

                <Button
                    disableFocusRipple
                    className={classes.button + " " + classes.item}
                    variant="outlined"
                    onClick={
                        () => console.log("test") /*handleOpenAddUserDialog*/
                    }
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
                                checked={publicSong.publicSongState}
                                onChange={handleChangePublicPrivate}
                                name="publicSongState"
                            />
                        </Grid>
                        <Grid item>Alle</Grid>
                    </Grid>
                </Typography>
                {publicSong.publicSongState ? (
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
                            disabled={!publicSong.publicSongState}
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
        </>
    )
}
