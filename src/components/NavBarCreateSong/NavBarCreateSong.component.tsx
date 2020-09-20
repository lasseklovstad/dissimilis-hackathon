import React, { useContext, useState, useEffect } from "react"
import {
    makeStyles,
    Grid,
    Typography,
    AppBar,
    Box,
    useMediaQuery,
    TextField,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { MenuButton } from "../MenuButton/MenuButton.component"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { ChoiceModal } from "../CustomModal/ChoiceModal.component"
import { usePutSong } from "../../utils/useApiServiceSongs"

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    left: {
        order: 1,
    },
    center: {
        order: 2,
        "@media (max-width:600px)": {
            order: 3,
            marginTop: "8px",
        },
    },
    right: {
        order: 3,
        "@media (max-width:600px)": {
            order: 2,
        },
    },
    appbar: {
        backgroundColor: "transparent",
        marginBottom: "24px",
    },
    textField: {
        width: "100%",
        height: "36px",
    },
    textFieldInput: {
        fontSize: "30",
    },
})

export const NavBarCreateSong = () => {
    const classes = useStyles()
    const [changing, setChanging] = useState(false)
    const [saveSongModalIsOpen, setSaveSongModalIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        song,
        song: { title },
    } = useContext(SongContext)
    const [newTitle, setNewTitle] = useState(title)
    const matches = useMediaQuery("(max-width:600px)")
    const { putSong } = usePutSong(song)
    const { t } = useTranslation()
    const history = useHistory()

    useEffect(() => {
        setNewTitle(title)
    }, [title])

    const handleSaveSong = () => {
        setIsLoading(true)
        putSong().then(({ result }) => {
            if (result && result.status >= 200 && result.status <= 299) {
                setIsLoading(false)
                setSaveSongModalIsOpen(false)
                history.push("/dashboard")
            } else {
                setIsLoading(false)
                setSaveSongModalIsOpen(false)
            }
        })
    }

    return (
        <Box className={classes.root} mb={matches ? 2 : 4}>
            <AppBar position="static" elevation={0} className={classes.appbar}>
                <Grid container>
                    <Grid item xs={11} sm={1} className={classes.left}>
                        <DashboardTopBarIcon
                            func={() => setSaveSongModalIsOpen(true)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={10} className={classes.center}>
                        <Box onClick={() => setChanging(!changing)}>
                            {changing ? (
                                <TextField
                                    error={newTitle === ""}
                                    onChange={(e) =>
                                        setNewTitle(e.target.value)
                                    }
                                    value={newTitle}
                                    inputProps={{ style: { fontSize: 24 } }}
                                    className={classes.textField}
                                    autoFocus
                                />
                            ) : (
                                <Typography variant="h2">{title}</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1} sm={1} className={classes.right}>
                        <MenuButton />
                    </Grid>
                </Grid>
            </AppBar>
            <ChoiceModal
                handleOnCancelClick={() => history.push("/dashbaord")}
                handleOnSaveClick={() => handleSaveSong()}
                handleClosed={() => setSaveSongModalIsOpen(false)}
                modalOpen={saveSongModalIsOpen}
                ackText={t("Modal:saveChanges")}
                cancelText={t("Modal:dontSaveChanges")}
                headerText={t("Modal:saveChangesPrompt")}
                descriptionText={t("Modal:saveChangesPromptDescription")}
                isLoading={isLoading}
            />
        </Box>
    )
}
