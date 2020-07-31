import React, { useContext, useState, useEffect } from "react";
import { makeStyles, Grid, Typography, AppBar, Box, useMediaQuery, TextField } from "@material-ui/core";
import MenuButton from "../MenuButton/MenuButton.component";
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons";
import { SongContext } from "../../views/SongView/SongContextProvider.component";
import { ChoiceModal } from "../CustomModal/ChoiceModal.component";
import { usePutSong } from "../../utils/usePutSong";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export type NavBarCreateSongProps = {
}

export const NavBarCreateSong: React.FC<NavBarCreateSongProps> = props => {
    const classes = useStyles();
    const [changing, setChanging] = useState(false);
    const [saveSongModalIsOpen, setSaveSongModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const { song, song: { title }, changeTitle } = useContext(SongContext);
    const [newTitle, setNewTitle] = useState(title)
    const matches = useMediaQuery("(max-width:600px)");
    const putSong = usePutSong(song)
    const { t } = useTranslation();
    const history = useHistory();

    useEffect(() => {
        setNewTitle(title);
    }, [title])




    const handleOpenSaveSongModal = () => {
        setSaveSongModalIsOpen(true)
    }

    const handleSaveSong = () => {
        setIsLoading(true)
        putSong().then(({ result }) => {
            if (result && result.status >= 200 && result.status <= 299) {
                setIsLoading(false);
                setSaveSongModalIsOpen(false);
                history.push("/dashboard");
            } else {
                setIsLoading(false);
                setSaveSongModalIsOpen(false);
            }
        });
    }


    const handleCloseSaveSongModal = () => {
        history.push("/dashbaord")
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setNewTitle(e.target.value)
    }

    const pressDown = (e: any) => {
        if (e.keyCode === 13) {
            if (e.target.value !== "") {
                changeTitle(e.target.value);
            }
            setChanging(!changing);
        }
        if (e.keyCode === 27) {
            if (newTitle !== "") {
                changeTitle(e.target.value);
            }
            setChanging(false)
        }
    }

    return (
        <Box className={classes.root} mb={matches ? 2 : 4}>
            <AppBar position="static" elevation={0} className={classes.appbar}>
                <Grid container>
                    <Grid item xs={11} sm={1} className={classes.left}>
                        <DashboardTopBarIcon func={handleOpenSaveSongModal} />
                    </Grid>
                    <Grid item xs={12} sm={10} className={classes.center}>
                        <Box onClick={() => setChanging(!changing)}>
                            {changing ? <TextField error={newTitle === ""} onChange={(e) => handleChange(e)} value={newTitle} inputProps={{ style: { fontSize: 24 } }} className={classes.textField} autoFocus onKeyDown={(e) => pressDown(e)} ></TextField> : <Typography variant="h2">{title}</Typography>}
                        </Box>
                    </Grid>
                    <Grid item xs={1} sm={1} className={classes.right} >
                        <MenuButton />
                    </Grid>
                </Grid>
            </AppBar>
            <ChoiceModal
                handleOnCancelClick={() => handleCloseSaveSongModal}
                handleOnSaveClick={() => handleSaveSong}
                handleClosed={() => () => { setSaveSongModalIsOpen(false) }}
                modalOpen={saveSongModalIsOpen}
                ackText={t("Modal:saveChanges")}
                cancelText={t("Modal:dontSaveChanges")}
                headerText={t("Modal:saveChangesPrompt")}
                descriptionText={t("Modal:saveChangesPromptDescription")}
                isLoading={isLoading}
            />
        </Box>
    );
};

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    left: {
        order: 1,
    },
    center: {
        order: 2,
        '@media (max-width:600px)': {
            order: 3,
            marginTop: "8px",
        },
    },
    right: {
        order: 3,
        '@media (max-width:600px)': {
            order: 2
        },
    },
    appbar: {
        backgroundColor: "transparent",
    },
    textField: {
        width: "100%",
        height: "36px",
    },
    textFieldInput: {
        fontSize: "30",
    }
});


export default NavBarCreateSong;