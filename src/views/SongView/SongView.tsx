import React, { useContext } from "react"
import { Grid, makeStyles, Snackbar, Typography } from "@material-ui/core"
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert"
import { NavBarCreateSong } from "../../components/NavBarCreateSong/NavBarCreateSong.component"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { SongContext } from "./SongContextProvider.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { Song } from "../../components/Song/Song.component"
import { useBarsPerRow } from "../../utils/useBarsPerRow"
import { useVoice } from "../../utils/useVoice"

const useStyles = makeStyles({
    root: {
        marginLeft: "16px",
        marginTop: "32px",
        marginRight: "16px",
        marginBottom: "200px",
        "@media (max-width: 1080px)": {
            marginBottom: "250px",
        },
        width: "auto",
    },
})

const heightOfBar = 160

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const SongView = () => {
    const classes = useStyles()

    const {
        song: { voices, timeSignature },
        isLoading,
        isSaving,
        setIsSaving,
    } = useContext(SongContext)

    const barsPerRow = useBarsPerRow()
    const selectedVoice = useVoice(voices.length)

    const handleClose = (
        event: React.SyntheticEvent | React.MouseEvent,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return
        }
        setIsSaving(false)
    }
    return (
        <>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <NavBarCreateSong />
                </Grid>
                <Grid item xs={12}>
                    <CreateSongTab />
                </Grid>
                {isLoading ? (
                    <Grid item xs={12}>
                        <LoadingLogo />
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Song
                            barsPerRow={barsPerRow}
                            selectedVoice={selectedVoice}
                            bars={voices[selectedVoice].bars}
                            timeSignature={timeSignature}
                            heightOfBar={heightOfBar}
                            exportMode={false}
                        />
                    </Grid>
                )}
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                autoHideDuration={4000}
                open={isSaving}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success">
                    <Typography variant="caption">Lagring vellykket</Typography>
                </Alert>
            </Snackbar>
            <BottomBar />
        </>
    )
}
